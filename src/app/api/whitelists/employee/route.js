import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Whitelist from "@/models/Whitelist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const whitelists = await Whitelist.find({ employee: session.user.id })
    .sort({ createdAt: -1 })
    .populate("employee")
    .populate({
      path: "program",
      match: { start_date: { $gte: new Date() } },
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  return NextResponse.json(whitelists);
}
