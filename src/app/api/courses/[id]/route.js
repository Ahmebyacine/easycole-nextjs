import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const course = await Course.findById(id);
  if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const { name, price, duree } = await req.json();
  const course = await Course.findByIdAndUpdate(
    id,
    { name, price, duree },
    { new: true, runValidators: true }
  );
  if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;
  const course = await Course.findByIdAndDelete(id);
  if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });
  return NextResponse.json({ message: "Course removed" }, { status: 200 });
}
