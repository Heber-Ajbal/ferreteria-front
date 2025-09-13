// src/utils/receipt.ts
// src/utils/receipt.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  
import type { RowInput } from "jspdf-autotable";
import QRCode from "qrcode";

type ReceiptItem = {
  name: string;
  qty: number;
  unitPrice: number;
  total: number; // qty * unitPrice
};

export type ReceiptData = {
  orderId: string | number;
  issuedAt?: string | Date;         // fecha/hora de emisión
  company?: {
    name: string;
    nit?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  customer?: {
    name: string;
    phone?: string;
    email?: string;
    nit?: string;
    address?: string;
  };
  summary: { subtotal: number; tax: number; shipping: number; total: number };
  items: ReceiptItem[];
  payment: { method: "cash" | "card" | "transfer"; reference?: string };
  delivery: { method: "pickup" | "delivery"; address?: string };
};

const moneyGTQ = (n: number) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(
    Number(n || 0)
  );

export async function generateReceiptPDF(data: ReceiptData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 40;
  const right = 555; // ancho A4 ~ 595pt - 40 margen

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.company?.name || "Ferretería", left, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let y = 68;
  if (data.company?.nit) doc.text(`NIT: ${data.company.nit}`, left, y), (y += 14);
  if (data.company?.address) doc.text(data.company.address, left, y), (y += 14);
  if (data.company?.phone) doc.text(`Tel: ${data.company.phone}`, left, y), (y += 14);
  if (data.company?.email) doc.text(data.company.email, left, y), (y += 14);

  // Bloque pedido
  let xRight = right;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("COMPROBANTE DE COMPRA", xRight, 50, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const issued = data.issuedAt ? new Date(data.issuedAt) : new Date();
  const fmtDate = issued.toLocaleString("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc.text(`Pedido #: ${String(data.orderId)}`, xRight, 68, { align: "right" });
  doc.text(`Fecha: ${fmtDate}`, xRight, 82, { align: "right" });

  // QR con info del pedido (opcional)
  try {
    const qrPayload = JSON.stringify({
      orderId: data.orderId,
      total: data.summary.total,
      issuedAt: issued.toISOString(),
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 0, width: 90 });
    doc.addImage(qrDataUrl, "PNG", xRight - 90, 95, 90, 90);
  } catch {
    // si falla QR, seguimos sin interrumpir
  }

  // Datos del cliente
  let yStart = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Cliente", left, yStart);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  yStart += 16;
  if (data.customer?.name) doc.text(`Nombre: ${data.customer.name}`, left, yStart), (yStart += 14);
  if (data.customer?.phone) doc.text(`Teléfono: ${data.customer.phone}`, left, yStart), (yStart += 14);
  if (data.customer?.email) doc.text(`Email: ${data.customer.email}`, left, yStart), (yStart += 14);
  if (data.customer?.nit) doc.text(`NIT: ${data.customer.nit}`, left, yStart), (yStart += 14);
  if (data.customer?.address) doc.text(`Dirección: ${data.customer.address}`, left, yStart), (yStart += 14);

  // Entrega y pago
  yStart += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Entrega y pago", left, yStart);
  doc.setFont("helvetica", "normal");
  yStart += 16;
  doc.text(
    `Entrega: ${data.delivery.method === "pickup" ? "Retiro en tienda" : "Domicilio"}`,
    left,
    yStart
  );
  yStart += 14;
  if (data.delivery.method === "delivery" && data.delivery.address) {
    doc.text(`Dirección de entrega: ${data.delivery.address}`, left, yStart);
    yStart += 14;
  }
  const payLabel =
    data.payment.method === "cash"
      ? "Efectivo"
      : data.payment.method === "card"
      ? "Tarjeta"
      : "Transferencia";
  doc.text(`Pago: ${payLabel}`, left, yStart);
  yStart += 14;
  if (data.payment.reference) {
    doc.text(`Referencia: ${data.payment.reference}`, left, yStart);
    yStart += 14;
  }

  // Tabla de ítems
  const body: RowInput[] = data.items.map((it) => [
    it.name,
    String(it.qty),
    moneyGTQ(it.unitPrice),
    moneyGTQ(it.total),
  ]);

  autoTable(doc, {
    startY: Math.max(yStart + 10, 210),
    head: [["Producto", "Cant.", "Precio", "Total"]],
    body,
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [15, 23, 42] }, // slate-900
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left, right: 40 },
  });

  // Totales
  const finalY = (doc as any).lastAutoTable?.finalY ?? 220;
  let yTotals = finalY + 16;
  const totalsX = right - 180;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Resumen", totalsX, yTotals);
  doc.setFont("helvetica", "normal");
  yTotals += 14;

  const line = (label: string, value: string) => {
    doc.text(label, totalsX, yTotals);
    doc.text(value, right, yTotals, { align: "right" });
    yTotals += 14;
  };

  line("Subtotal:", moneyGTQ(data.summary.subtotal));
  line("Impuestos:", moneyGTQ(data.summary.tax));
  line("Envío:", data.summary.shipping ? moneyGTQ(data.summary.shipping) : "Gratis");
  doc.setFont("helvetica", "bold");
  line("Total:", moneyGTQ(data.summary.total));

  // Nota legal
  yTotals += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Este comprobante no reemplaza una factura fiscal. Conserva este documento para cualquier cambio o garantía.",
    left,
    yTotals
  );

  // Footer
  doc.setFontSize(9);
  doc.text("¡Gracias por tu compra! 💙", left, 820);
  if (data.company?.name) doc.text(`${data.company.name} · ${fmtDate}`, right, 820, { align: "right" });

  // Guardar
  const filename = `comprobante_${data.orderId}.pdf`;
  doc.save(filename);
}
