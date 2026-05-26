import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Phone } from "@/types/inventory";
import { formatCurrency } from "./format";

export function generateInventoryPDF(phones: Phone[]) {
  const doc = new jsPDF("p", "pt", "letter");
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;

  const brandBlue = "#0284c7"; 
  const darkSlate = "#0f172a"; 
  const textGray = "#475569";  
  const lightBg = "#f8fafc";   
  
  doc.setFillColor(darkSlate);
  doc.rect(0, 0, pageWidth, 90, "F");
  
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("CELULARES BIENESTAR", marginX, 45);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#94a3b8"); // slate-400
  doc.text("Sistema Integral de Gestión de Inventario", marginX, 65);


  doc.setTextColor(darkSlate);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte Detallado de Inventario", marginX, 130);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textGray);
  
  // Fecha alineada a la derecha
  const dateStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const dateText = `Fecha: ${dateStr}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, pageWidth - marginX - dateWidth, 130);

  doc.setFillColor(lightBg);
  doc.setDrawColor("#e2e8f0"); // slate-200
  doc.roundedRect(marginX, 145, pageWidth - (marginX * 2), 35, 5, 5, "FD");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(brandBlue);
  doc.text(`Total de dispositivos en este reporte: ${phones.length} equipos`, marginX + 15, 168);

  const tableData = phones.map((p, index) => [
    (index + 1).toString(),
    p.id,
    p.marca,
    p.modelo,
    p.anio.toString(),
    formatCurrency(p.precio),
  ]);

  autoTable(doc, {
    startY: 200,
    head: [["No.", "ID", "Marca", "Modelo", "Año", "Precio Unitario"]],
    body: tableData,
    theme: "plain", 
    headStyles: {
      fillColor: brandBlue,
      textColor: "#ffffff",
      fontStyle: "bold",
      fontSize: 10,
      valign: "middle",
      cellPadding: { top: 10, right: 10, bottom: 10, left: 10 },
    },
    bodyStyles: {
      textColor: darkSlate,
      fontSize: 10,
      cellPadding: 12,
      lineColor: "#f1f5f9", 
      lineWidth: { bottom: 1 },
    },
    alternateRowStyles: {
      fillColor: lightBg, 
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center", textColor: textGray },
      1: { cellWidth: 80, fontSize: 8, textColor: textGray },
      2: { cellWidth: 90, fontStyle: "bold" },
      3: { cellWidth: 160 },
      4: { cellWidth: 50, halign: "center" },
      5: { halign: "right", fontStyle: "bold", textColor: brandBlue }, 
    },
    didDrawPage: (data) => {
      doc.setDrawColor("#cbd5e1"); // slate-300
      doc.line(marginX, pageHeight - 40, pageWidth - marginX, pageHeight - 40);
      
      doc.setFontSize(8);
      doc.setTextColor(textGray);
      doc.text("Generado automáticamente por Celulares Bienestar", marginX, pageHeight - 25);
      
   
      const pageStr = `Página ${doc.getCurrentPageInfo().pageNumber}`;
      const pageStrWidth = doc.getTextWidth(pageStr);
      doc.text(pageStr, pageWidth - marginX - pageStrWidth, pageHeight - 25);
    },
  });

  doc.save("Inventario de celulares.pdf");
}