import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Whitelist from "@/models/Whitelist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Create a new whitelist
// @route POST /api/whitelists
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { name, phone, program, note } = await req.json();

  const whitelist = await Whitelist.create({
    name,
    phone,
    employee: session.user.id,
    program,
    note,
  });

  const whitelistPopulate = await Whitelist.findById(whitelist._id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  return NextResponse.json(whitelistPopulate, { status: 201 });
}

// @desc Get all whitelists
// @route GET /api/whitelists
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const whitelists = await Whitelist.find({})
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

  return NextResponse.json(whitelists);
}
