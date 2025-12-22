import PDFDocument, { fontSize } from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import {
  addOneYear,
  formatDate,
  formatFrenchDate,
  formatShortFrenchDate,
} from "@/utils/formatSafeDate";

const fontsPath = path.join(process.cwd(), "src", "assets", "fonts");

export async function generateCertificatConformitePDF(values = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 10,
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

      // INFO ROW helper (label right, value left)
      const infoRow = (label, value, opts = {}) => {
        const labelW = pageWidth * 0.4;
        const labelX = doc.page.width / 5;
        const valueX = opts.valueX || 350;
        const startY = doc.y;

        // Label
        font("bold", opts.labelSize || 11);
        doc.text(`• ${label}`, labelX, startY, {
          width: labelW,
          align: "left",
        });

        // Value with ABSOLUTE POSITION
        font("normal", opts.valueSize || 11);
        doc.text(String(value ?? "-"), valueX, startY, {
          align: "left",
        });

        // Move cursor manually after row height
        const rowHeight = opts.rowHeight || 20;
        doc.y = startY + rowHeight;
        doc.x = 0;
      };

      // Header block: three columns
      const startX = doc.page.margins.left;

      doc.table({
        columnStyles: [100, "*", 100],
        defaultStyle: { padding: [4, 2, 0, 2], fontSize: 8 },
        data: [
          [
            "ECT-CHEDES",
            {
              text: "Enregistremen\nCertificat/rapport de visite d'un Equipement",
              align: "center",
            },
            `D: ${
              values.dateOfInspection
                ? formatFrenchDate(values.dateOfInspection)
                : ""
            } \nRef: ${values.reportRef || ""}`,
          ],
        ],
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
      font("bold", 10);
      doc.text(
        `EL oued, On: ${
          values.dateOfInspection
            ? formatFrenchDate(values.dateOfInspection)
            : "-"
        }`,
        startX + 30,
        footerY,
        {
          width: colW,
          align: "left",
        }
      );
      doc.text("Inspector :", startX + colW + 15, footerY, {
        width: colW,
        align: "center",
      });
      doc.text("Approved by :", startX + 2 * colW - 30, footerY, {
        width: colW,
        align: "right",
      });

      // ----------------- PAGE 2 - REPORT / TABLE DE VISITE -----------------
      doc.addPage();
      // Title for report
      font("bold", 16);
      doc.text("RAPPORT DE VISITE D'UN EQUIPEMENT", {
        align: "center",
        underline: true,
        width: pageWidth,
      });
      font("normal", 10);
      doc.text("Borthwork Appliance Certificate", {
        align: "center",
        width: pageWidth,
      });
      doc.text(
        "Décret exécutif '91-05 du19-jane--1991, relatif aux presertations générales de protection applicables en matière",
        {
          align: "center",
          width: pageWidth,
        }
      );

      doc.moveDown(0.4);

      doc.font("Helvetica-Bold").fontSize(9);
      doc.table({
        columnStyles: [230, "*"],
        data: [
          [
            `PROPRIETAIRE/Owner ${values?.customer}`,
            `REF RAPPORT/Report REF: ${values?.reportRef}`,
          ],
          [
            `PRODUIT /Deseription: ${
              values?.description
            } DATE D'INTERVENTION/Date of inspection (${formatFrenchDate(
              values?.dateOfInspection
            )})`,
            `CONTRUCTEUR /Manufacturer ${values?.manufacturer}`,
          ],
          [
            "CARACTERISTIQUES TECHNIQUES /Characteristics",
            "DERNIER CONTR /last inspection",
          ],
          [
            `N'DE SERIEText /Serial number ${values?.serialNumber}`,
            "TYPE D'ININTERVENTION:/Periodique/DATE Kid of inspection (initial/(X)Periodic/intermediate)",
          ],
          [`MODEL/Type: ${values?.model}`, "EFFECTUE PAR/Fecformed by:"],
        ],
      });
      let imageCell = null;
      doc.table({
        columnStyles: [230, "*", 32, 32, 32],
        defaultStyle: { padding: [3, 2, 0, 2] },
        rowStyles: (i) => {
          if (i === 4 && !imageCell) {
            imageCell = {
              x: doc.x,
              y: doc.y,
              width: 230,
            };
          }
        },
        data: [
          [
            `ANNEE DE FABRICATION: ${values?.yearOfManufacture}\nYear of Manufactured`,
            {
              text: "CONTROLES EFFECTUES\nInspections performed",
              align: "center",
            },
            { text: "ST", align: "center" },
            { text: "NA", align: "center" },
            { text: "VO", align: "center" },
          ],
          [
            "CAPACITE DE GODET:\nCapacity",
            "Examen du chassis, traverses, et fixation\nExamination of the frame, cross, and fixed",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "DIAMETRE DU CABLE (EN MM):\nDiameter of cable (mm)",
            "Examen des stabilisteurs, pneumatique et autres (chenilles)\nExamination of the stabilired tires and others tracked",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "ORGANE DE PREHENSION:\nGripping body",
            "Contrôle système, niveau des liquides hydrauliques\ncontrol system, the level of hydraulic fluids.",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            {
              rowSpan: 17,
              text: "",
              border: [1, 1, 0, 1],
            },
            "Vérifiés les bouchons et fermetures des systèmes hydrauliques\nVerified caps and closures hydraulic systems",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Contrôle des fonctions, et des liminaux (feux, Gyrophare,...)\nControl functions, and liminal (ights, Emergency Light)",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Constitution de la cabine, visibilité, accés, protection toit\nConstitution of the cabin, visibility, access, protection root",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Proprete, stockage carburant, protection incendie\nCleanliness, off storage, and fire protection1",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Protection des organes mobile (fixation), chute d'objet\nMoves bodies protection (Maine), falis of object",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Contrôle toutes les parties habituellement graissées\nContorl all parties usually greased",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Examen de l'état des freins des mouvements, et rotations\nExamination of the state of the brakes of the movements.",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Limiteur de vitesse, capacité, et fonctionnement\nSpeed limited, capacity, and operation",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Appareils de prehhension, et protection contre la chute",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Affichage des consignes et avertisseur sonore",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [
            "Acces pour visite registre, et verification periodique",
            { text: "X", align: "center" },
            "",
            "",
          ],
          [{ colSpan: 4, text: "CONCLUSION", align: "center" }],
          ["Controle initail/ Initial check", "", "", ""],
          [
            "Controle periodique/Periodic check",
            { text: "X", align: "center" },
            "",
            "",
          ],
          ["Contrôle intermédiaire/intermediate check", "", "", ""],
          ["Contrôle exceptionnel/Exceptional check", "", "", ""],
        ],
      });

      doc.table({
        columnStyles: [230, "*", "*", "*"],
        data: [
          [
            { text: "", border: [0, 1, 1, 1] },
            "* ST: SATISFAISANT\nSatisfactory",
            "NA: NON APPLICABLE\nNot applicable",
            "VO: VOIR OBSERVATION\nSee remark",
          ],
          [
            {
              colSpan: 4,
              text: "COMMENTAIRES/Comment: CET APPAREL EST BON ETAT, DOIT EIRE MAINTENIR EN SERVICES",
              padding: 5,
            },
          ],
          [
            {
              colSpan: 4,
              text: "OBSERVATIONS/Remarks: R.A.S",
              padding: 5,
            },
          ],
        ],
      });

      doc.table({
        columnStyles: ["*", "*", "*"],
        defaultStyle: { padding: [4, 2, 0, 2] },
        data: [
          [
            {
              rowSpan: 2,
              text: `PROCHAIN CONTROLE/Next inspection\nPERIODIQUE: ${formatShortFrenchDate(
                addOneYear(values?.dateOfInspection)
              )}\nPeriodic\nNTERMEDIAIRE: -10 jours/${formatShortFrenchDate(
                addOneYear(values?.dateOfInspection)
              )}/+10 jours\nIntermediate`,
            },
            {
              text: `ETABLI A/Issued at: EL OUED\nCONTROLE EFFECTUE'PAR/performed by:\n${values?.manager}\n`,
            },
            {
              rowSpan: 2,
              text: `Le, On:  ${formatFrenchDate(values?.dateOfInspection)}`,
            },
          ],
          [
            "VISA ET CACHET-Signature and stampAccording to the algerian regulations (Please see above)\n",
          ],
        ],
      });
      if (values.equipmentImage){
      const ROW_COUNT = 17;
      const ROW_HEIGHT = 12;
      const imageHeight = ROW_COUNT * ROW_HEIGHT;
      if (imageCell) {
        const imgWidth = 220; // auto scale
        const imgHeight = 120;

        const imgX = imageCell.x + (imageCell.width - imgWidth) / 2;
        const imgY = imageCell.y + (imageHeight - imgHeight) / 2 + 20;
        doc.image(values.equipmentImage, imgX, imgY, {
          width: imgWidth,
        });
      }}

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
