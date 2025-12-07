import PDFDocument from "pdfkit";
import path from "path";
import { formatFrenchDate } from "@/utils/formatSafeDate";

const fontsPath = path.join(process.cwd(), "src/assets/fonts");

export async function generateWhitelistPDF(whitelists) {
  const doc = new PDFDocument({
    margin: 20,
    size: "A4",
    layout: "portrait",
  });

  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  const endPromise = new Promise((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(buffers)))
  );

  // Fonts
  doc.registerFont("Cairo", path.join(fontsPath, "Cairo-Regular.ttf"));
  doc.registerFont("CairoBold", path.join(fontsPath, "Cairo-Bold.ttf"));

  // ------------------ HEADER ------------------
  doc
    .font("CairoBold")
    .fontSize(20)
    .text("قائمة قيد التسجيل", { align: "center", features: ["rtla"] });

  const program = whitelists[0].program;

  doc
    .font("Cairo")
    .fontSize(14)
    .text(`البرنامج: ${program?.course?.name || ""}`, {
      align: "right",
      features: ["rtla"],
    });
  doc.text(`المؤسسة: ${program?.institution?.name || ""}`, {
    align: "right",
    features: ["rtla"],
  });
  doc.text(`المدرب: ${program?.trainer?.name || ""}`, {
    align: "right",
    features: ["rtla"],
  });

  doc.moveDown(1);

  // ------------------ GROUP BY EMPLOYEE ------------------
  const grouped = {};
  whitelists.forEach((item) => {
    const empName = item.employee?.name || "موظف غير معروف";
    if (!grouped[empName]) grouped[empName] = [];
    grouped[empName].push(item);
  });

  // ------------------ PRINT ENTRIES ------------------
  for (const empName of Object.keys(grouped)) {
    doc
      .font("CairoBold")
      .fontSize(16)
      .text(`الموظف: ${empName}`, { align: "right", features: ["rtla"] });

    doc.strokeColor("#000");
    doc.moveDown(0.2);

    // ---------------- TABLE CONFIG ----------------
    const tableHeaders = ["التاريخ", "الملاحظة", "الحالة", "الهاتف", "الاسم"];

    const colWidths = [100, 140, 60, 120, 120];
    const startX = 25;

    // ---------------- DRAW TABLE HEADER ----------------
    const drawTableHeader = () => {
      doc.font("CairoBold").fontSize(12);
      let x = startX;
      const y = doc.y;

      tableHeaders.forEach((header, i) => {
        doc.text(header, x - 5, y, {
          width: colWidths[i],
          align: "right",
          features: ["rtla"],
        });
        x += colWidths[i];
      });

      // خط تحت العنوان
      doc
        .moveTo(startX, y + 22)
        .lineTo(startX + colWidths.reduce((a, b) => a + b), y + 22)
        .stroke();
    };

    // ---------------- DRAW TABLE ROW ----------------
    const drawRow = (entry) => {
      doc.font("Cairo").fontSize(11);

      const xStart = startX;
      const rowData = [
        formatFrenchDate(entry.createdAt),
        entry.note || "-",
        entry.status === "new" ? "جديد" : "ملغي",
        entry.phone,
        entry.name,
      ];

      // 1️⃣ احسب ارتفاع كل خلية
      const cellHeights = rowData.map((cell, i) => {
        return doc.heightOfString(cell, {
          width: colWidths[i],
          align: "right",
          features: ["rtla"],
        });
      });
      // 2️⃣ استخدم أكبر ارتفاع كارتفاع الصف
      const rowHeight = Math.max(...cellHeights, 25); // 20 كحد أدنى

      // 3️⃣ ارسم كل خلية
      let x = xStart;
      const y = doc.y;

      rowData.forEach((cell, i) => {
        doc.text(cell, x - 5, y, {
          width: colWidths[i],
          align: "right",
          features: ["rtla"],
        });

        // خطوط العمود الرأسية
        doc
          .moveTo(x, y)
          .lineTo(x, y + rowHeight)
          .strokeColor("#CCC")
          .stroke();

        x += colWidths[i];
      });

      // خط العمود الأخير
      doc
        .moveTo(xStart + colWidths.reduce((a, b) => a + b), y)
        .lineTo(xStart + colWidths.reduce((a, b) => a + b), y + rowHeight)
        .stroke();

      // خط أفقي أسفل الصف
      doc
        .moveTo(xStart, y + rowHeight)
        .lineTo(xStart + colWidths.reduce((a, b) => a + b), y + rowHeight)
        .strokeColor("#CCC")
        .stroke();

      // 4️⃣ انتقل للسطر التالي
      if (rowHeight > 25) doc.y += rowHeight / 2;
    };

    // ---------------- USE THE TABLE ----------------
    drawTableHeader();
    grouped[empName].forEach((entry) => {
      drawRow(entry);
      if (doc.y > 800) {
        doc.addPage();
      }
    });
    doc.moveDown(1);
  }

  doc.end();
  return endPromise;
}
