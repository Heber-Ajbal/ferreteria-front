// src/utils/stockReport.ts
import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";

export type StockRow = { productId:number; name:string; stock:number };
export type StockFilters = {
  q?: string;
  idFilter?: string;
  nameFilter?: string;
  statusFilter?: string;   // 'Sin stock' | 'Stock bajo' | 'Stock medio' | 'Stock alto' | ''
  stockMin?: string;       // como string (tal como lo tienes en inputs)
  stockMax?: string;
};

export type StockPdfOptions = {
  /** Base64 de logo (sin cabecera data:...); si lo pasas, va en el header */
  logoBase64?: string;
  /** Ancho en px del logo (opcional) */
  logoWidth?: number;
  /** Título principal (default: Inventario de Stock) */
  title?: string;
  /** Nombre del archivo (default: reporte_stock_YYYY-MM-DD_hh-mm.pdf) */
  filename?: string;
};

const stockStatus = (n: number) => {
  if (n === 0) return "Sin stock";
  if (n < 10) return "Stock bajo";
  if (n < 50) return "Stock medio";
  return "Stock alto";
};

const nowStr = () => {
  const d = new Date();
  const pad = (n:number)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * Genera y descarga un PDF del stock usando jsPDF + autoTable.
 * @param data filas ya filtradas y ordenadas (usa tu computed `filtered`)
 * @param filters filtros activos para mostrarlos como chips
 * @param opts opciones visuales (logo, título, filename)
 */
export function generateStockPDF(
  data: StockRow[],
  filters: StockFilters = {},
  opts: StockPdfOptions = {}
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let cursorY = 48;

  const title = opts.title ?? "Inventario de Stock";
  const subtitle = `Generado: ${nowStr()}`;

  // Header con logo (opcional)
  if (opts.logoBase64) {
    try {
      const w = opts.logoWidth ?? 90;
      const h = w * 0.35; // relación aproximada
      doc.addImage(`data:image/png;base64,${opts.logoBase64}`, "PNG", marginX, cursorY - 12, w, h);
      cursorY += 10;
    } catch { /* no romper si el logo falla */ }
  }

  // Badge "Reporte de Stock"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const badge = "Reporte de Stock";
  const badgeW = doc.getTextWidth(badge) + 14;
  doc.setDrawColor(230); doc.setFillColor(245, 247, 255);
  doc.roundedRect(pageWidth - marginX - badgeW, cursorY - 16, badgeW, 22, 10, 10, "FD");
  doc.setTextColor(60);
  doc.text(badge, pageWidth - marginX - badgeW + 7, cursorY);

  // Título y fecha
  doc.setTextColor(20);
  doc.setFontSize(20);
  doc.text(title, marginX, cursorY);
  cursorY += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(subtitle, marginX, cursorY);
  cursorY += 12;

  // Chips de filtros activos
  const chips: string[] = [];
  if (filters.idFilter) chips.push(`ID contiene: ${filters.idFilter}`);
  if (filters.nameFilter) chips.push(`Nombre contiene: ${filters.nameFilter}`);
  if (filters.statusFilter) chips.push(`Estado: ${filters.statusFilter}`);
  if (filters.stockMin || filters.stockMax) chips.push(`Rango: ${filters.stockMin || "0"}–${filters.stockMax || "∞"}`);
  if (filters.q) chips.push(`Búsqueda: ${filters.q}`);

  if (chips.length) {
    let x = marginX, y = cursorY + 8;
    doc.setFontSize(10);
    doc.setTextColor(70);
    doc.setDrawColor(230);
    chips.forEach((txt) => {
      const w = doc.getTextWidth(txt) + 16;
      if (x + w > pageWidth - marginX) { // salto de línea
        x = marginX; y += 22;
      }
      doc.roundedRect(x, y - 12, w, 20, 10, 10);
      doc.text(txt, x + 8, y + 2);
      x += w + 8;
    });
    cursorY = y + 16;
  } else {
    cursorY += 8;
  }

  // Tabla
  const body: RowInput[] = data.map(r => [
    r.productId,
    r.name,
    stockStatus(r.stock),
    { content: r.stock, styles: { halign: "right" as const } },
  ]);

  const totalUnidades = data.reduce((acc, r) => acc + r.stock, 0);

  autoTable(doc, {
    startY: cursorY,
    head: [["ID", "Producto", "Estado", "Cantidad"]],
    body,
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6, textColor: [17,24,39] },
    headStyles: {
      fillColor: [37, 99, 235], // azul
      halign: "left",
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: { 3: { halign: "right" } },
    theme: "striped",
    didDrawPage: (dataHook) => {
      // Footer con paginación
      const str = `Página ${doc.getNumberOfPages()}`;
      doc.setFontSize(9); doc.setTextColor(120);
      doc.text(str, pageWidth - marginX, doc.internal.pageSize.getHeight() - 16, { align: "right" });
    },
  });

  // Resumen de totales
  const afterTableY = (doc as any).lastAutoTable?.finalY ?? cursorY;
  doc.setFontSize(11);
  doc.setTextColor(55);
  doc.text(`${data.length} productos`, marginX, afterTableY + 24);
  doc.text(`Total unidades: ${totalUnidades}`, pageWidth - marginX, afterTableY + 24, { align: "right" });

  // Guardar
  const defaultName = `reporte_stock_${nowStr().replace(/[: ]/g,'_')}.pdf`;
  doc.save(opts.filename || defaultName);
}
