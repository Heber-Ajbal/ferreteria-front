// src/services/purchases.ts
import api from '../lib/api';

export type PurchaseItem = { productId:number; qty:number; unitCost:number; taxRate?:number };
export async function createPurchase(payload:{ supplierId:number; invoiceNumber?:string; purchaseDate?:string; items:PurchaseItem[] }) {
  const { data } = await api.post('/purchases', payload);
  return data as { purchaseId:number; status:string };
}
// export async function receivePurchase(id:number, userId?:number) {
//   const { data } = await api.post(`/purchases/${id}/receive`, userId ? { userId } : {});
//   return data as { purchaseId:number; status:string; subtotal:number; tax:number };
// }

export async function receivePurchase(id: number, userId?: number) {
  const body = userId !== undefined ? { userId: Number(userId) } : {};
  const { data } = await api.post(`/purchases/${id}/receive`, body);
  return data as { purchaseId:number; status:string; subtotal:number; tax:number };
}

export async function getStock() {
  const { data } = await api.get('/purchases/stock');
  return data as { productId:number; name:string; stock:number }[];
}
