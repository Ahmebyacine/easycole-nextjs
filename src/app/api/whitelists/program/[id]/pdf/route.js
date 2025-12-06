import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateWhitelistPDF } from "@/lib/pdf/whitelist";
import Whitelist from "@/models/Whitelist";
import "@/lib/models";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const whitelists = await Whitelist.find({ program: id })
    .sort({ createdAt: -1 })
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  if (!whitelists || whitelists.length === 0) {
    return new NextResponse(JSON.stringify({ message: "No data found" }), {
      status: 404,
    });
  }

  const pdfBuffer = await generateWhitelistPDF(whitelists);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=whitelist-${id}.pdf`,
    },
  });
}
