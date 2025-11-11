import { NextResponse } from "next/server";
import Trainer from "@/models/Trainer";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Create new trainer
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const { name, email, phone } = await req.json();

  const trainer = await Trainer.create({ name, email, phone });

  return NextResponse.json(trainer, { status: 201 });
}

// @desc Get all trainers
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const trainers = await Trainer.find({}).sort({ createdAt: -1 });
  return NextResponse.json(trainers);
}
