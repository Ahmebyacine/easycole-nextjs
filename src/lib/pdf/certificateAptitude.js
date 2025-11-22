import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { formatFrenchDate, addOneYear } from "@/utils/formatSafeDate";

export async function generateCertificateDAptitudePDF(values) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 40, bottom: 40, left: 47, right: 47 },
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

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

      // Background image
      const bgImagePath = path.join(
        process.cwd(),
        "src/assets/images/image.png"
      );

      // PAGES PER TRAINEE
      values.trainees.forEach((trainee, index) => {
        if (index > 0) doc.addPage();

        // Background
        if (fs.existsSync(bgImagePath)) {
          doc.image(bgImagePath, 10, 10, {
            width: doc.page.width - 20,
            height: doc.page.height - 20,
          });
        }
        doc
          .font("Calibri")
          .fontSize(18)
          .text("ETABLISSEMENT PRIVE DE FORMATION PROFESSIONNELLE", 40, 60, {
            align: "center",
            width: doc.page.width - 94,
            lineGap: 8,
          });

        doc.fontSize(14).text("Agrée par", {
          align: "center",
          lineGap: 6,
        });
        doc.text(
          "MINISTÈRE DE LA FORMATION ET DE L'ENSEIGNEMENT PROFESSIONNELS",
          {
            align: "center",
            lineGap: 6,
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
            lineGap: 10,
          }
        );

        // TITLE
        doc.font("Tahoma").fontSize(24).text("CERTIFICAT D'APTITUDE", 0, doc.y, {
          align: "center",
          lineGap: 20,
        });

        // BODY
        doc.font("Tahoma").fontSize(14).fillColor("black");

        doc.text(
          `La Direction de l’Etablissement Privé de la Formation Professionnelle WADFOR :
Vu le décret n°01-419 du 5 chaoual 1422 correspondant au 20 décembre 2001 fixant les conditions de création d'ouverture, de contrôle des établissement privés de la formation professionnelle.
Vu la décision d’agrément n°1904 du 18 AOUT 2018.
Vu le procès-verbal des délibérations en date du : ${formatFrenchDate(
            values.trainingDate
          )}.
Il est attribué à Mr/Ms : `,
          60,
          doc.y,
          {
            align: "left",
            continued: true,
            lineGap: 4,
          }
        );

        doc.fillColor("#1E4F79").text(trainee.fullName);

        doc.fillColor("black").text("Né le : ", { continued: true });
        doc.fillColor("#1E4F79").text(formatFrenchDate(trainee.birthDate), {
          continued: true,
        });

        doc.fillColor("black").text("      à : ", { continued: true });
        doc.fillColor("#1E4F79").text(trainee.birthPlace, { continued: true });

        doc.fillColor("black").text("      wilaya : ", { continued: true });
        doc.fillColor("#1E4F79").text(trainee.wilaya);

        doc.moveDown(0.5);

        // Specialty
        doc
          .fillColor("black")
          .text(
            "L’attestation de formation qualifiante intensif dans la spécialité : ",
            { continued: true }
          );
        doc.fillColor("#1E4F79").text(values.specialty, {
          lineGap: 4,
        });

        // Duration section (styled as requested)
        doc
          .fillColor("black")
          .text(
            "Ce certificat est délivré pour une durée d’une année (12 mois)..........du ",
            { continued: true }
          );

        doc.fillColor("#1E4F79").text(formatFrenchDate(values.trainingDate), {
          continued: true,
        });

        doc.fillColor("black").text(" au ", { continued: true });

        doc
          .fillColor("#1E4F79")
          .text(formatFrenchDate(addOneYear(values.trainingDate)), {
            lineGap: 4,
          });

        doc
          .fillColor("black")
          .text(
            "Ce certificat lui est délivré pour servir et valoir ce que de droit."
          );

        // FOOTER
        const footerY = doc.page.height - 120;

        doc.fontSize(12).text("Le Directeur :", 100, footerY);

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
