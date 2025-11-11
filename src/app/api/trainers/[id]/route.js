import { NextResponse } from "next/server";
import Trainer from "@/models/Trainer";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Get single trainer
export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const trainer = await Trainer.findById(id);
  if (!trainer)
    return new Response(JSON.stringify({ message: "Trainer not found" }), {
      status: 404,
    });

  return NextResponse.json(trainer);
}

// @desc Update trainer
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { name, email, phone } = await req.json();

  const trainer = await Trainer.findByIdAndUpdate(
    id,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  if (!trainer)
    return new Response(JSON.stringify({ message: "Trainer not found" }), {
      status: 404,
    });

  return NextResponse.json(trainer);
}

// @desc Delete trainer (admin only)
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const trainer = await Trainer.findByIdAndDelete(id);

  if (!trainer)
    return new Response(JSON.stringify({ message: "Trainer not found" }), {
      status: 404,
    });

  return new Response(null, { status: 204 });
}
