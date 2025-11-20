import PDFDocument from "pdfkit";
import path from "path";
import { generateQRCode } from "@/utils/generateQRCode";

const fontsPath = path.join(process.cwd(), "src/assets/fonts");

export async function generateReceiptPDF(data) {
  const qr = await generateQRCode(data._id.toString());
  const doc = new PDFDocument({
    size: "A4",
    layout: "portrait",
    margin: 20,
  });

  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const endPromise = new Promise((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(buffers)))
  );
  doc.registerFont("Cairo", path.join(fontsPath, "Cairo-Regular.ttf"));
  doc.registerFont("CairoBold", path.join(fontsPath, "Cairo-Bold.ttf"));

  // ----------------------------
  // HEADER
  // ----------------------------
  doc
    .font("Cairo")
    .fontSize(14)
    .text(data.program.institution.name, {
      align: "right",
      features: ["rtla"],
    });
  doc
    .font("Cairo")
    .fontSize(12)
    .text(data.program.institution.address, {
      align: "right",
      features: ["rtla"],
    });
  doc.font("Cairo").text(`${data.program.institution.phone} الاتصال:`, {
    align: "right",
  });

  doc
    .font("CairoBold")
    .fontSize(18)
    .text("وصل استلام", { align: "center", features: ["rtla"] });

  doc
    .moveTo(40, doc.y + 10)
    .lineTo(555, doc.y + 10)
    .stroke();

  // ----------------------------
  // Helpers
  // ----------------------------
  const sectionTitle = (title) => {
    doc.moveDown();
    doc
      .font("CairoBold")
      .fontSize(16)
      .text(title, { align: "right", features: ["rtla"] });
    doc
      .moveTo(40, doc.y + 2)
      .lineTo(555, doc.y + 2)
      .strokeColor("#666")
      .stroke();
    doc.strokeColor("#000");
    doc.moveDown(0.5);
  };

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

  // ----------------------------
  // CONTENT
  // ----------------------------
  sectionTitle("معلومات الموظف");
  row("الاسم", data.employee?.name);

  sectionTitle("معلومات العميل");
  row("الاسم", data.name);
  row("البريد الإلكتروني", data.email);
  row("الهاتف", data.phone);

  sectionTitle("تفاصيل البرنامج");
  row("اسم الدورة", data.program.course?.name);
  row("سعر البرنامج", data.totalPrice);

  sectionTitle("معلومات الدفع");
  row("المبلغ المدفوع", data.inialTranche);
  row("المبلغ الإجمالي", data.totalPrice);

  doc
    .font("CairoBold")
    .fillColor("#e74c3c")
    .text("المبلغ المتبقي:", {
      continued: true,
      align: "right",
      features: ["rtla"],
    });
  doc.font("CairoBold").fillColor("#e74c3c").text(data.rest, -75, doc.y);
  doc.fillColor("#000");

  sectionTitle("تفاصيل العملية");
  row(
    "تاريخ الدفع",
    new Date().toLocaleDateString("fr", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  );

  // ----------------------------
  // FOOTER + QR
  // ----------------------------
  const qrX = doc.page.width / 2 - 40;
  const qrY = doc.page.height - 140;

  const qrBuffer = Buffer.from(qr.split(",")[1], "base64");
  doc.image(qrBuffer, qrX, qrY, {
    width: 80,
    height: 80,
  });
  doc
    .font("Cairo")
    .fontSize(12)
    .text(data._id, qrX - 50, qrY + 75, {
      width: 200,
      align: "center",
    });

  doc.end();
  return endPromise;
}
