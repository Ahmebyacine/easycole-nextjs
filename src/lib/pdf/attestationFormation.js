import PDFDocument from "pdfkit";
import { formatFrenchDate } from "@/utils/formatSafeDate";
import fs from "fs";
import path from "path";

export async function generateAttestationFormationPDF(values) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 40, bottom: 40, left: 47, right: 47 },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Background image
      const bgImagePath = path.join(
        process.cwd(),
        "src",
        "assets",
        "images",
        "image.png"
      );

      // Fonts
      const calibriFont = path.join(
        process.cwd(),
        "src",
        "assets",
        "fonts",
        "Calibri-Bold.ttf"
      );
      const tahomaFont = path.join(
        process.cwd(),
        "src",
        "assets",
        "fonts",
        "Tahoma.ttf"
      );

      doc.registerFont("Calibri", calibriFont);
      doc.registerFont("Tahoma", tahomaFont);

      // Loop trainees
      values.trainees.forEach((trainee, index) => {
        if (index > 0) doc.addPage();

        // Background image
        if (fs.existsSync(bgImagePath)) {
          doc.image(bgImagePath, 10, 10, {
            width: doc.page.width - 20,
            height: doc.page.height - 20,
          });
        }

        // Header
        doc
          .font("Calibri")
          .fontSize(18)
          .text(
            "ETABLISSEMENT PRIVE DE FORMATION PROFESSIONNELLE",
            40,
            60,
            {
              align: "center",
              width: doc.page.width - 94,
              lineGap: 8,
            }
          );

        doc.fontSize(14).text("Agrée par", {
          align: "center",
          lineGap: 8,
        });

        doc.text(
          "MINISTÈRE DE LA FORMATION ET DE L'ENSEIGNEMENT PROFESSIONNELS",
          {
            align: "center",
            lineGap: 8,
          }
        );

        const currentY = doc.y;

        doc
          .font("Calibri")
          .fontSize(12)
          .text("Agréé par l'état N : 1904/18", 60, currentY, {
            width: doc.page.width / 2 - 60,
            align: "left",
          });

        doc.text(
          `Attestation N : ${values?.certificateNumber}/${
            index + Number(values?.initialCertificateNumber)
          }`,
          doc.page.width / 2,
          currentY,
          {
            width: doc.page.width / 2 - 70,
            align: "right",
            lineGap: 15,
          }
        );

        // Title
        doc
          .font("Tahoma")
          .fontSize(26)
          .text("Attestation de Formation", 0, doc.y, {
            align: "center",
            lineGap: 30,
          });

        // Body
        doc.font("Calibri").fontSize(16).fillColor("#000000");

        const bodyText = `La Direction de l'Etablissement Privé de la Formation Professionnelle WADFOR :
Vu le décret n°01-419 du 5 chaoual 1422 correspondant au 20 décembre 2001 fixan les conditions de création d'ouverture, de contrôle des établissement privés de la formation professionnelle.
Vu la décision d'agrément n° 1904 du 18 AOUT 2018.
Vu le procès-verbal des délibérations en date du : ${formatFrenchDate(
          values?.trainingDate
        )}.
Il est attribué à Mr/Ms : `;

        doc.text(bodyText, 60, doc.y, {
          align: "left",
          continued: true,
          lineGap: 8,
        });

        // Name
        doc.fillColor("#1E4F79").text(trainee?.fullName);

        // Birth info
        doc.fillColor("#000000").text("Né le : ", { continued: true });

        doc.fillColor("#1E4F79").text(trainee?.birthDate, { continued: true });

        doc.fillColor("#000000").text("               à : ", { continued: true });

        doc.fillColor("#1E4F79").text(trainee?.birthPlace, { continued: true });

        doc
          .fillColor("#000000")
          .text("               wilaya : ", { continued: true });

        doc
          .fillColor("#1E4F79")
          .text(trainee?.wilaya, {
            continued: false,
            lineGap: 8,
          });

        // Specialty
        doc
          .fillColor("#000000")
          .text(
            "L'attestation de formation qualifiante intensif dans la spécialité : ",
            {
              continued: true,
            }
          );

        doc.fillColor("#1E4F79").text(values?.specialty);

        // Footer
        const footerY = doc.page.height - 120;

        doc
          .fillColor("#000000")
          .fontSize(12)
          .text("Le Directeur :", 100, footerY, {
            width: doc.page.width / 2 - 100,
            align: "left",
          });

        doc.text(
          `Le : ${formatFrenchDate(values?.trainingDate)}`,
          doc.page.width / 2,
          footerY,
          {
            width: doc.page.width / 2 - 100,
            align: "right",
          }
        );
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
