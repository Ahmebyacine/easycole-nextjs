import { generateAttestationFormationDureePDF } from "@/lib/pdf/attestationFormationDuree";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const values = await req.json();
  const pdfBuffer = await generateAttestationFormationDureePDF(values);
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="attestation-formation-duree.pdf"',
    },
  });
}
