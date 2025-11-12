import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "@/lib/models";

// @desc get a single lead
export async function GET(req, { params }) {
  await connectDB();
  const lead = await Lead.findById(params.id).populate("course");
  if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
  return NextResponse.json(lead);
}

// @desc update a lead
export async function PUT(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, phone, wilaya, course, status } = await req.json();
  const lead = await Lead.findByIdAndUpdate(
    params.id,
    { name, phone, wilaya, course, status },
    { new: true, runValidators: true }
  ).populate("course");

  if (!lead)
    return NextResponse.json({ message: "Lead not found" }, { status: 404 });

  return NextResponse.json(lead);
}

// @desc delete a lead (admin only)
export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin")
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const lead = await Lead.findByIdAndDelete(params.id);
  if (!lead)
    return NextResponse.json({ message: "Lead not found" }, { status: 404 });

  return NextResponse.json({ message: "Lead removed" }, { status: 204 });
}
