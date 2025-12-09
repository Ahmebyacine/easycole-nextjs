import PDFDocument from "pdfkit";
import path from "path";
import { formatFrenchDate } from "@/utils/formatSafeDate";

const fontsPath = path.join(process.cwd(), "src/assets/fonts");

export async function generateProgramReportPDF(data) {
  const doc = new PDFDocument({
    margin: 15,
    size: "A4",
    layout: "portrait",
  });

  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  const endPromise = new Promise((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(buffers)))
  );

  // ---------------- FONT REGISTRATION ----------------
  doc.registerFont("Cairo", path.join(fontsPath, "Cairo-Regular.ttf"));
  doc.registerFont("CairoBold", path.join(fontsPath, "Cairo-Bold.ttf"));

  // ----------------HRLPER ---------------------

  const row = (label, value) => {
    doc
      .font("CairoBold")
      .fontSize(12)
      .text(`${label}:`, {
        continued: true,
        align: "right",
        features: ["rtla"],
      });
    doc
      .font("Cairo")
      .fontSize(12)
      .text(value, -(doc.widthOfString(label) + 3), doc.y);
  };

  // ---------------- PAGE HEADER ----------------
  doc
    .font("CairoBold")
    .fontSize(20)
    .text(data.program.name, { align: "center", features: ["rtla"] });

  doc.moveDown(0.1);

  row("المؤسسة", data.program.institution);
  row("المدرب", data.program.trainer);
  row("تاريخ البداية", formatFrenchDate(data.program.start_date));
  row("تاريخ النهاية", formatFrenchDate(data.program.end_date));

  doc.moveDown(0.5);

  // ---------------- TABLE CONFIG ----------------
  const colWidths = {
    note: 80,
    totalPrice: 80,
    unpaid: 50,
    paid: 50,
    phone: 90,
    email: 120,
    name: 100,
  };

  const tableHeaders = [
    { key: "note", label: "ملاحظات" },
    { key: "totalPrice", label: "المبلغ الكلي" },
    { key: "unpaid", label: "المتبقي" },
    { key: "paid", label: "المدفوع" },
    { key: "phone", label: "الهاتف" },
    { key: "email", label: "البريد" },
    { key: "name", label: "الاسم" },
  ];

  const startX = 15;

  const safeAddPage = () => {
    if (doc.y > 750) doc.addPage();
  };

  // ---------------- DRAW TABLE HEADER ----------------
  const drawTableHeader = () => {
    doc.font("CairoBold").fontSize(12);

    let x = startX;
    const y = doc.y;

    tableHeaders.forEach((h) => {
      doc.text(h.label, x - 5, y, {
        width: colWidths[h.key],
        align: "right",
      });
      x += colWidths[h.key];
    });

    doc
      .moveTo(startX, y + 20)
      .lineTo(x, y + 20)
      .strokeColor("#000")
      .stroke();
  };

  // ---------------- DRAW TABLE ROW ----------------
  const drawRow = (t) => {
    doc.font("Cairo").fontSize(11);

    const rowData = {
      note: t.note || "-",
      totalPrice: t.totalPrice?.toString() || "0",
      unpaid: t.unpaidAmount?.toString() || "0",
      paid: t.paidAmount?.toString() || "0",
      phone: t.phone || "-",
      email: t.email || "-",
      name: t.name || "-",
    };

    // Compute heights
    const heights = Object.keys(rowData).map((key) =>
      doc.heightOfString(rowData[key], {
        width: colWidths[key],
        align: "right",
      })
    );
    const rowHeight = Math.max(...heights, 22);

    const y = doc.y;
    let x = startX;

    Object.keys(rowData).forEach((key) => {
      doc.text(rowData[key], x - 5, y, {
        width: colWidths[key],
        align: "right",
      });

      doc
        .moveTo(x, y)
        .lineTo(x, y + rowHeight)
        .strokeColor("#CCC")
        .stroke();

      x += colWidths[key];
    });

    // Last vertical line
    doc
      .moveTo(x, y)
      .lineTo(x, y + rowHeight)
      .strokeColor("#CCC")
      .stroke();

    // Bottom line
    doc
      .moveTo(startX, y + rowHeight)
      .lineTo(x, y + rowHeight)
      .strokeColor("#CCC")
      .stroke();

    if (rowHeight > 25) doc.y += rowHeight / 2;
    safeAddPage();
  };

  // ---------------- PER EMPLOYEE SECTION ----------------
  for (const emp of data.employees) {
    doc
      .font("CairoBold")
      .fontSize(16)
      .text(`${emp.employee.email} - ${emp.employee.name}`, 0, doc.y, {
        align: "right",
      });

    doc.moveDown(0.5);

    drawTableHeader();

    emp.trainees.forEach((t) => drawRow(t));


    doc.moveDown(0.2);
    safeAddPage();
  }
  doc.end();
  return endPromise;
}
