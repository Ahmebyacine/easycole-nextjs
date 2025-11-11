import { connectDB } from "@/lib/mongodb";
import Institution from "@/models/Institution";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc GET single institution
export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const institution = await Institution.findById(id);
  if (!institution)
    return NextResponse.json(
      { message: "Institution not found" },
      { status: 404 }
    );
  return NextResponse.json(institution);
}

//@desc UPDATE single institution (admin only)
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  try {
    const { name, address, phone } = await req.json();
    const updated = await Institution.findByIdAndUpdate(
      id,
      { name, address, phone },
      { new: true, runValidators: true }
    );

    if (!updated)
      return NextResponse.json(
        { message: "Institution not found" },
        { status: 404 }
      );

     return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

//@desc DELETE single institution (admin only)
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const deleted = await Institution.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json(
      { message: "Institution not found" },
      { status: 404 }
    );

  return NextResponse.json({ message: "Institution removed" }, { status: 200 });
}
