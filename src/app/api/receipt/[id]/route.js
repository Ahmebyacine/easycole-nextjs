import { connectDB } from "@/lib/mongodb";
import { generateReceiptPDF } from "@/lib/pdf/receipt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Trainee from "@/models/Trainee";
import "@/lib/models";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const trainee = await Trainee.findById(id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  if (!trainee)
    return new Response(JSON.stringify({ message: "Trainee not found" }), {
      status: 404,
    });

  const pdfBuffer = await generateReceiptPDF(trainee);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=receipt-${id}.pdf`,
    },
  });
}
