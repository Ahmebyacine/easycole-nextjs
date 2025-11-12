import { NextResponse } from "next/server";
import Program from "@/models/Program";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import "@/lib/models";

//@desc Get a program by ID
export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const program = await Program.findById(id).populate(
    "course institution trainer"
  );
  if (!program)
    return NextResponse.json({ error: "Program not found" }, { status: 404 });

  return NextResponse.json(program);
}

//@desc update a program
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const updates = await req.json();

  const updated = await Program.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("course institution trainer");

  if (!updated)
    return NextResponse.json({ error: "Program not found" }, { status: 404 });

  return NextResponse.json(updated);
}

//@delete a program (soft delete)
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const deleted = await Program.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!deleted)
    return NextResponse.json({ error: "Program not found" }, { status: 404 });

  return NextResponse.json({ message: "Program deleted", deleted });
}
