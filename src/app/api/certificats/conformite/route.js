import { NextResponse } from "next/server";
import { generateCertificatConformitePDF } from "@/lib/pdf/certificatConformite";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { reportRef } = await req.json();
    // validate body lightly
    //if (!body) {
    //  return NextResponse.json({ message: "Missing body" }, { status: 400 });
    //}

    console.log(reportRef);
    const data = {
      reportRef: "REF-001",
      dateOfInspection: "2025-11-21",
      description: "Excavator Model X",
      customer: "ACME Corp",
      manufacturer: "ACME Industries",
      model: "X-1000",
      workingLoadLimit: "2000 kg",
      yearOfManufacture: "2020",
      serialNumber: "SN-123456",
      equipmentImage: "data:image/png;base64,...", // optional data URL
      manager: "Inspector Name",
      notes: "...",
      checks: ["Check 1", "Check 2"], // optional array for table rows
    };

    const pdfBuffer = await generateCertificatConformitePDF(data);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=certificat-${
          reportRef || "report"
        }.pdf`,
      },
    });
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
