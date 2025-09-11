// src/services/sales.ts
import api from "../lib/api";

export type CheckoutItem = { productId: number | string; quantity: number; unitPrice: number };
export type CheckoutPayload = {
  items: CheckoutItem[];
  summary: { subtotal: number; tax: number; shipping: number; total: number };
  customer: { name: string; phone: string; email?: string; nit?: string; address?: string };
  delivery: { method: "pickup" | "delivery" };
  payment: { method: "cash" | "card" | "transfer"; reference?: string };
};

export type ServerCart = {
  saleId: number | null;
  status: "CART" | "PAID" | "EMPTY";
  taxRate?: number;
  items: Array<{ productId: number; name: string; qty: number; unitPrice: number; lineTotal: number }>;
  subtotal: number;
  taxAmount: number;
  discountTotal?: number;
  total: number;
};

// --- API helpers ---
export async function createOrGetServerCart(taxRate = 12): Promise<ServerCart> {
  const { data } = await api.post("/sales/cart", { taxRate });
  return data;
}
export async function getServerCart(): Promise<ServerCart> {
  const { data } = await api.get("/sales/cart");
  return data;
}
export async function addItemServer(productId: number | string, qty: number) {
  const { data } = await api.post("/sales/cart/items", { productId: Number(productId), qty: Number(qty) });
  return data as ServerCart;
}
export async function setItemServer(productId: number | string, qty: number) {
  const { data } = await api.put("/sales/cart/items", { productId: Number(productId), qty: Number(qty) });
  return data as ServerCart;
}
export async function removeItemServer(productId: number | string) {
  const { data } = await api.delete(`/sales/cart/items/${Number(productId)}`);
  return data as ServerCart;
}
export async function checkoutServer(dto: any) {
  const { data } = await api.post("/sales/cart/checkout", dto);
  return data as { saleId: number; status: "PAID"; total: number };
}

// --- Sincroniza carrito local con el del servidor y hace checkout ---
export async function placeOrder(payload: CheckoutPayload) {
  // 1) Asegurar carrito en servidor (usa tasa IVA del front)
  await createOrGetServerCart(Math.round((payload.summary.tax / Math.max(1, payload.summary.subtotal)) * 100) || 12);

  // 2) Obtener items actuales del server
  const server = await getServerCart();
  const serverMap = new Map(server.items.map((i) => [Number(i.productId), i.qty]));

  // 3) Sincronizar: set/add/remove para que el server quede = carrito local
  //    (a) upsert/ajustar cantidades existentes
  for (const it of payload.items) {
    const pid = Number(it.productId);
    const q = Number(it.quantity);
    if (serverMap.has(pid)) {
      if (serverMap.get(pid) !== q) await setItemServer(pid, q);
      serverMap.delete(pid); // marcado como sincronizado
    } else {
      await addItemServer(pid, q);
    }
  }
  //    (b) quitar en server los que ya no están en local
  for (const [pid] of serverMap) {
    await removeItemServer(pid);
  }

  // 4) Checkout (el backend hoy solo marca PAID)
  const checkoutDto = {
    customer: payload.customer,
    delivery: payload.delivery,
    payment: payload.payment,
    summary: payload.summary, // el backend no lo usa aún, pero lo enviamos para futuro
  };
  return checkoutServer(checkoutDto);
}