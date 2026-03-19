import PDFDocument, { y } from "pdfkit";
import path from "path";

const fontsPath = path.join(process.cwd(), "src/assets/fonts");

export function generateAttendanceReportPDF({
  name,
  month,
  rows = [],
  totalHours,
}) {
  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 25 });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const endPromise = new Promise((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(buffers))),
  );

  doc.registerFont("Cairo", path.join(fontsPath, "Cairo-Regular.ttf"));
  doc.registerFont("CairoBold", path.join(fontsPath, "Cairo-Bold.ttf"));

  doc
    .font("CairoBold")
    .fontSize(20)
    .text("تقرير الحضور الشهري", { align: "center", features: ["rtla"] });
  doc.moveDown(1);

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
      .text(value, -doc.widthOfString(label), doc.y);
  };

  row("اسم الموظف", name);
  row("الشهر", month);

  doc.moveDown(1);

  // ---------------- TABLE CENTERING ----------------
  const columnStyles = ["*", "*", "*", "*"];

  const tableOptions = () => ({
    columnStyles,
    defaultStyle: { align: "center" },
  });

  doc.table({
    ...tableOptions("CairoBold"),
    data: [["عدد الساعات", "الخروج", "الدخول", "التاريخ"]],
  });

  rows.forEach((r) => {
    doc.table({
      ...tableOptions("Cairo"),
      data: [
        [r.workedHours.toFixed(2), r.checkOut || "-", r.checkIn || "-", r.date],
      ],
    });
  });

  doc.moveDown(1);
  row("إجمالي ساعات العمل", `${totalHours.toFixed(2)}`);

  doc.end();

  return endPromise;
}
