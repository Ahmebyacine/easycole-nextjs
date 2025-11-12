import { NextResponse } from "next/server";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import "@/lib/models";

// @desc Create new trainee
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );

  const {
    name,
    email,
    phone,
    program,
    inialTranche,
    methodePaiement1,
    discount,
    totalPrice,
    note,
  } = await req.json();

  const trainee = await Trainee.create({
    name,
    email,
    phone,
    employee: session.user.id,
    program,
    inialTranche,
    methodePaiement1,
    rest: totalPrice - inialTranche,
    totalPrice,
    discount,
    note,
  });

  const populated = await Trainee.findById(trainee._id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [{ path: "course" }, { path: "institution" }, { path: "trainer" }],
    });

  return NextResponse.json(populated, { status: 201 });
}

// @desc Get all trainees
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );

  const trainees = await Trainee.find({})
    .sort({ createdAt: -1 })
    .populate("employee")
    .populate({
      path: "program",
      populate: [{ path: "course" }, { path: "institution" }, { path: "trainer" }],
    });

  return NextResponse.json(trainees);
}
