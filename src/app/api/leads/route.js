import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "@/lib/models";

// @desc get all leads
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const leads = await Lead.find({}).sort({ createdAt: -1 }).populate("course");
  return NextResponse.json(leads);
}

// @desc create a lead
export async function POST(req) {
  await connectDB();

  const { name, phone, wilaya, course } = await req.json();

  const lead = await Lead.create({ name, phone, wilaya, course });
  const leadPopulated = await Lead.findById(lead._id).populate("course");

  return NextResponse.json(leadPopulated, { status: 201 });
}
