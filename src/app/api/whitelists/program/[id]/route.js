import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Whitelist from "@/models/Whitelist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "@/lib/models";

export async function GET(req, context) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
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
    })
    .exec();

  return NextResponse.json(whitelists);
}
