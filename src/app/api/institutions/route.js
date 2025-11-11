import { connectDB } from "@/lib/mongodb";
import Institution from "@/models/Institution";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc GET all institutions / POST create institution
export async function GET() {
  await connectDB();
  const institutions = await Institution.find({});
  return NextResponse.json(institutions);
}

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { name, address, phone } = await req.json();
  const institution = await Institution.create({ name, address, phone });

  return NextResponse.json(institution, { status: 201 });
}
