import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generateCertificateDAptitudePDF } from "@/lib/pdf/certificateAptitude";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const values = await req.json();
  const pdfBuffer = await generateCertificateDAptitudePDF(values);
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="certificate-aptitude.pdf"',
    },
  });
}
