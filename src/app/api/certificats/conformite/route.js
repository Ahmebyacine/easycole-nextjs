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
    const body = await req.json();
    // validate body lightly
    if (!body) {
      return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }

    const pdfBuffer = await generateCertificatConformitePDF(body);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=certificat-${
          body.reportRef || "report"
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
