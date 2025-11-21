import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { formatDate, formatFrenchDate } from "@/utils/formatSafeDate";

/**
 * generateCertificatConformitePDF(data)
 * - data: object containing fields used in the certificate and report.
 *   Expected shape (example):
 *   {
 *     reportRef: "REF-001",
 *     dateOfInspection: "2025-11-21",
 *     description: "Excavator Model X",
 *     customer: "ACME Corp",
 *     manufacturer: "ACME Industries",
 *     model: "X-1000",
 *     workingLoadLimit: "2000 kg",
 *     yearOfManufacture: "2020",
 *     serialNumber: "SN-123456",
 *     equipmentImage: "data:image/png;base64,...", // optional data URL
 *     manager: "Inspector Name",
 *     notes: "...",
 *     checks: [ "Check 1", "Check 2", ... ] // optional array for table rows
 *   }
 *
 * Returns a Buffer containing the PDF
 */

const fontsPath = path.join(process.cwd(), "src", "assets", "fonts");

export async function generateCertificatConformitePDF(values = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 28,
        autoFirstPage: false,
      });

      // collect buffers
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      doc.registerFont("Cairo", path.join(fontsPath, "Cairo-Regular.ttf"));
      doc.registerFont("Cairo-Bold", path.join(fontsPath, "Cairo-Bold.ttf"));

      // PAGE 1 - Certificate
      doc.addPage();

      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // Small helpers for styling and layout
      const font = (name, size = 10) => {
        try {
          if (name === "bold") doc.font("Cairo-Bold");
          else doc.font("Cairo");
        } catch {
          doc.font(name === "bold" ? "Helvetica-Bold" : "Helvetica");
        }
        doc.fontSize(size);
      };

      const drawHr = (yOffset = 6) => {
        const x = doc.x;
        doc
          .moveTo(doc.page.margins.left, doc.y + yOffset)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y + yOffset)
          .stroke();
        doc.moveDown(0.4);
      };

      // INFO ROW helper (label right, value left)
      const infoRow = (label, value, opts = {}) => {
        const labelW = pageWidth * 0.4;
        const valueW = pageWidth - labelW;
        font("bold", opts.labelSize || 10);
        doc.text(`• ${label}`, doc.page.width / 6, doc.y, {
          width: labelW,
          align: "left",
          continued: true,
        });
        font("normal", opts.valueSize || 10);
        doc.text(String(value ?? "-"), doc.page.width / 3, doc.y,{
          align: "left",
        });
        doc.moveDown(0.12);
      };

      // BOXED ROW helper (draw a rectangular row then put text)
      const boxedRow = (x, y, w, h) => {
        doc.rect(x, y, w, h).stroke();
      };

      // Header block: three columns
      const startX = doc.page.margins.left;
      let curY = doc.y;
      let headerH = 56;
      const leftW = pageWidth * 0.15;
      const centerW = pageWidth * 0.7;
      const rightW = pageWidth * 0.15;

      // header border
      doc.save().lineWidth(0.8).rect(startX, curY, pageWidth, headerH).stroke();
      // left column
      font("normal", 8);
      doc.text("ECT-CHEDES", startX + 8, curY + 8, {
        width: leftW - 16,
        align: "left",
      });

      // center column
      font("normal", 12);
      doc.text("Enregistremen", startX + leftW, curY + 6, {
        width: centerW,
        align: "center",
      });
      font("normal", 10);
      doc.text(
        "Certificat/rapport de visite d'un Equipement",
        startX + leftW,
        curY + 26,
        {
          width: centerW,
          align: "center",
        }
      );

      // right column (date & ref)
      font("normal", 8);
      const rightX = startX + leftW + centerW;
      doc.text(
        `D: ${
          values.dateOfInspection
            ? formatFrenchDate(values.dateOfInspection)
            : ""
        }`,
        rightX + 6,
        curY + 8,
        {
          width: rightW - 12,
          align: "left",
        }
      );
      doc.text(`Ref: ${values.reportRef || ""}`, rightX + 6, curY + 26, {
        width: rightW - 12,
        align: "left",
      });

      doc.moveDown(2);

      // Title
      font("bold", 16);
      doc.text("CERTIFICAT DE CONFORMITE", 0, doc.y, {
        align: "center",
      });
      font("normal", 14);
      doc.text(`Pour: conformité (${values.description || ""})`, {
        align: "center",
      });

      // Intro paragraphs
      font("normal", 10);
      const frenchIntro =
        "Nous soussignés, ECT.CHEDES certifions que l’équipement suivant a été examiné conformément aux normes internationales appropriées et qu’aucune défectuosité de nature à nuire à la sécurité de son utilisation n’a été constatée au moment de l’inspection.";
      doc.text(frenchIntro, { align: "center" });
      doc.moveDown(0.2);

      const englishIntro =
        "We the undersigned, ECT.CHEDES, certify that the following equipment has been inspected in accordance with the appropriate international standards and found to be free of any defect likely to affect safety at the time of inspection.";
      doc.text(englishIntro, { align: "center" });
      doc.moveDown(0.6);

      // Info table rows
      infoRow("Description (Produit)", values.description || "-");
      infoRow("Client", values.customer || "-");
      infoRow("Fabricant", values.manufacturer || "-");
      infoRow("Model (Type)", values.model || "-");
      infoRow("Utilization (Charge max.)", values.workingLoadLimit || "-");
      infoRow("Année de fabrication", values.yearOfManufacture || "-");
      infoRow(
        "Date d’inspection",
        values.dateOfInspection
          ? formatFrenchDate(values.dateOfInspection)
          : "-"
      );
      infoRow("Numéro de série", values.serialNumber || "-");
      infoRow("Capacité", values.capacity || "-");

      doc.moveDown(0.8);

      font("normal", 11);
      doc.text(
        "Ce certificat est délivré pour une période de Douze (12) mois",
        { align: "center", width: pageWidth }
      );
      doc.moveDown(0.2);
      font("normal", 10);
      doc.text(
        "The certificate should be for a period of twelve (12) months.",
        { align: "center", width: pageWidth }
      );

      doc.moveDown(1);

      // Footer three columns: date, inspector, approved
      const footerY = doc.y;
      const colW = pageWidth / 3;
      font("normal", 10);
      doc.text(
        `EL oued, On: ${
          values.dateOfInspection ? formatDate(values.dateOfInspection) : "-"
        }`,
        startX,
        footerY,
        {
          width: colW,
          align: "left",
        }
      );
      doc.text("Inspector :", startX + colW, footerY, {
        width: colW,
        align: "center",
      });
      doc.text("Approved by :", startX + 2 * colW, footerY, {
        width: colW,
        align: "right",
      });

      // ----------------- PAGE 2 - REPORT / TABLE DE VISITE -----------------
      doc.addPage();
      // Title for report
      font("bold", 14);
      doc.text("RAPPORT DE VISITE D'UN EQUIPEMENT", {
        align: "center",
        width: pageWidth,
      });
      doc.moveDown(0.3);
      font("normal", 10);
      doc.text("Borthwork Appliance Certificate", {
        align: "center",
        width: pageWidth,
      });
      doc.moveDown(0.5);

      // Top rows: Owner / Product / Manufacturer / Date of intervention
      const labelW = pageWidth * 0.4;
      const valueW = pageWidth - labelW;

      // Owner row
      font("bold", 9);
      doc.text("PROPRIETAIRE / Owner:", {
        width: labelW,
        align: "right",
        continued: true,
      });
      font("normal", 9);
      doc.text(values.customer || "-", { width: valueW, align: "left" });
      doc.moveDown(0.2);

      // Report ref on right of top area
      font("bold", 9);
      doc.text("REF RAPPORT / Report Ref:", {
        width: labelW,
        align: "right",
        continued: true,
      });
      font("normal", 9);
      doc.text(values.reportRef || "-", { width: valueW, align: "left" });
      doc.moveDown(0.2);

      // Product description & date of inspection
      font("bold", 9);
      doc.text("PRODUIT / Description:", {
        width: labelW,
        align: "right",
        continued: true,
      });
      font("normal", 9);
      doc.text(
        `${values.description || "-"} — DATE D'INTERVENTION: ${
          values.dateOfInspection ? formatDate(values.dateOfInspection) : "-"
        }`,
        { width: valueW, align: "left" }
      );
      doc.moveDown(0.2);

      // Manufacturer
      font("bold", 9);
      doc.text("CONSTRUCTEUR / Manufacturer:", {
        width: labelW,
        align: "right",
        continued: true,
      });
      font("normal", 9);
      doc.text(values.manufacturer || "-", { width: valueW, align: "left" });
      doc.moveDown(0.4);

      // Technical characteristics area
      const section = (lbl, text) => {
        font("bold", 9);
        doc.text(lbl, { width: labelW, align: "right", continued: true });
        font("normal", 9);
        doc.text(text || "-", { width: valueW, align: "left" });
        doc.moveDown(0.15);
      };

      section("CARACTERISTIQUES TECHNIQUES / Characteristics", "");
      section("N° DE SERIE / Serial number", values.serialNumber || "-");
      section("MODEL / Type", values.model || "-");
      section("ANNEE DE FABRICATION / Year", values.yearOfManufacture || "-");

      doc.moveDown(0.4);

      // Controls table (left column list + 3 small columns ST/NA/VO)
      const tableX = doc.page.margins.left;
      let tableY = doc.y;
      const tableWidth = pageWidth;
      const leftColW = Math.round(tableWidth * 0.61);
      const rightColsW = tableWidth - leftColW;
      const oneColW = Math.round(rightColsW / 3);

      // Draw header rectangle for the table
      headerH = 22;
      doc
        .save()
        .lineWidth(0.8)
        .rect(tableX, tableY, tableWidth, headerH)
        .stroke();
      font("bold", 9);
      doc.text(
        "CONTROLES EFFECTUES / Inspections performed",
        tableX + 6,
        tableY + 6,
        {
          width: leftColW - 12,
          align: "center",
        }
      );
      doc.text("ST", tableX + leftColW, tableY + 6, {
        width: oneColW,
        align: "center",
      });
      doc.text("NA", tableX + leftColW + oneColW, tableY + 6, {
        width: oneColW,
        align: "center",
      });
      doc.text("VO", tableX + leftColW + 2 * oneColW, tableY + 6, {
        width: oneColW,
        align: "center",
      });

      tableY += headerH + 6;
      doc.moveTo(tableX, tableY - 2);

      const checks =
        Array.isArray(values.checks) && values.checks.length
          ? values.checks
          : [
              "Examen du chassis, traverses, et fixation",
              "Examen des stabilisateurs, pneumatique et autres (chenilles)",
              "Examen de l'état des freins des mouvements, et rotations",
              "Limiteur de vitesse, capacité, et fonctionnement",
              "Appareils de préhension, et protection contre la chute",
              "Affichage des consignes et avertisseur sonore",
            ];

      // Draw each check row: rectangle, left text and empty ST/NA/VO cells
      const rowH = 22;
      for (let i = 0; i < checks.length; i++) {
        // If we are too low on page, add new page and redraw table header
        if (tableY + rowH > doc.page.height - doc.page.margins.bottom - 120) {
          doc.addPage();
          tableY = doc.y;
          // redraw table header on new page
          doc
            .save()
            .lineWidth(0.8)
            .rect(tableX, tableY, tableWidth, headerH)
            .stroke();
          font("bold", 9);
          doc.text(
            "CONTROLES EFFECTUES / Inspections performed",
            tableX + 6,
            tableY + 6,
            { width: leftColW - 12, align: "center" }
          );
          doc.text("ST", tableX + leftColW, tableY + 6, {
            width: oneColW,
            align: "center",
          });
          doc.text("NA", tableX + leftColW + oneColW, tableY + 6, {
            width: oneColW,
            align: "center",
          });
          doc.text("VO", tableX + leftColW + 2 * oneColW, tableY + 6, {
            width: oneColW,
            align: "center",
          });
          tableY += headerH + 6;
        }

        // row box
        doc.rect(tableX, tableY, tableWidth, rowH).stroke();
        // left text
        font("normal", 9);
        doc.text(checks[i], tableX + 6, tableY + 6, {
          width: leftColW - 12,
          align: "left",
        });
        // ST/NA/VO markers (empty by default)
        font("normal", 9);
        // Optionally pre-fill first row as "X" to indicate sample
        const fillST = values.preFillFirstRow ? (i === 0 ? "X" : "") : "";
        doc.text(fillST, tableX + leftColW, tableY + 6, {
          width: oneColW,
          align: "center",
        });
        doc.text("", tableX + leftColW + oneColW, tableY + 6, {
          width: oneColW,
          align: "center",
        });
        doc.text("", tableX + leftColW + 2 * oneColW, tableY + 6, {
          width: oneColW,
          align: "center",
        });

        tableY += rowH + 6;
      }

      // Move doc cursor below table
      doc.y = tableY + 4;

      doc.moveDown(0.4);

      // Conclusion header
      font("bold", 10);
      doc.text("CONCLUSION", { align: "center", width: pageWidth });
      doc.moveDown(0.3);

      // Conclusion check types
      const conclusionChecks = [
        {
          label: "Controle initial / Initial check",
          checked: !!values.conclusion?.initial,
        },
        {
          label: "Controle periodique / Periodic check",
          checked: !!values.conclusion?.periodic,
        },
        {
          label: "Contrôle intermédiaire / intermediate check",
          checked: !!values.conclusion?.intermediate,
        },
        {
          label: "Contrôle exceptionnel / Exceptional check",
          checked: !!values.conclusion?.exceptional,
        },
      ];

      conclusionChecks.forEach((c) => {
        font("normal", 9);
        doc.text(`${c.checked ? "X" : " "}  ${c.label}`, {
          align: "left",
          width: pageWidth,
        });
        doc.moveDown(0.1);
      });

      doc.moveDown(0.4);

      // Legend: ST / NA / VO
      font("normal", 8);
      doc.text("*ST: SATISFAISANT / Satisfactory", {
        continued: true,
        width: leftColW,
        align: "left",
      });
      doc.text("NA: NON APPLICABLE / Not applicable", {
        continued: true,
        width: oneColW,
        align: "left",
      });
      doc.text("VO: VOIR OBSERVATION / See remark", {
        width: oneColW,
        align: "left",
      });

      doc.moveDown(0.6);

      // Comments and Observations
      font("bold", 9);
      doc.text("COMMENTAIRES / Comment:", { align: "left", width: pageWidth });
      font("normal", 9);
      doc.text(values.comments || values.notes || "—", {
        align: "left",
        width: pageWidth,
      });
      doc.moveDown(0.4);
      font("bold", 9);
      doc.text("OBSERVATIONS / Remarks:", { align: "left", width: pageWidth });
      font("normal", 9);
      doc.text(values.observations || "-", { align: "left", width: pageWidth });

      doc.moveDown(0.6);

      // Next inspection and signature columns
      const footerBlockY = doc.y;
      const blockW = pageWidth / 3;
      font("normal", 9);
      doc.text(
        `PROCHAIN CONTROLE/Next inspection: ${
          values.nextInspection || formatDate(values.dateOfInspection)
        }`,
        tableX,
        footerBlockY,
        {
          width: blockW,
          align: "left",
        }
      );
      doc.text(`ETABLI A/Issued at: EL OUED`, tableX + blockW, footerBlockY, {
        width: blockW,
        align: "left",
      });
      doc.text(
        `Le, On: ${
          values.dateOfInspection ? formatDate(values.dateOfInspection) : "-"
        }`,
        tableX + 2 * blockW,
        footerBlockY,
        {
          width: blockW,
          align: "left",
        }
      );

      doc.moveDown(1);

      doc.text(
        `CONTROLE EFFECTUE PAR / performed by: ${values.manager || "-"}`,
        { align: "left", width: pageWidth }
      );
      doc.moveDown(0.6);
      doc.text("VISA ET CACHET - Signature and stamp", {
        align: "left",
        width: pageWidth,
      });

      // Render equipment image if provided as data URL
      if (
        values.equipmentImage &&
        typeof values.equipmentImage === "string" &&
        values.equipmentImage.startsWith("data:")
      ) {
        try {
          const base64 = values.equipmentImage.split(",")[1];
          const img = Buffer.from(base64, "base64");
          // place image on the left under signature area if space, else top-right of current page
          const imgX = doc.page.margins.left;
          const imgY = doc.y + 8;
          const maxW = 140;
          const maxH = 100;
          doc.image(img, imgX, imgY, { width: maxW, height: maxH });
        } catch (err) {
          // ignore image errors
        }
      }

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
