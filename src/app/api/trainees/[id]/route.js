import { NextResponse } from "next/server";
import Trainee from "@/models/Trainee";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Get single trainee
export async function GET(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const { id } = params;

  const trainee = await Trainee.findById(id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  if (!trainee)
    return new Response(JSON.stringify({ message: "Trainee not found" }), {
      status: 404,
    });
  return NextResponse.json(trainee);
}

// @desc Update trainee
export async function PUT(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const { id } = params;
  const updates = await req.json();

  const trainee = await Trainee.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!trainee)
    return new Response(JSON.stringify({ message: "Trainee not found" }), {
      status: 404,
    });

  const populated = await Trainee.findById(trainee._id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [{ path: "course" }, { path: "institution" }],
    });

  return NextResponse.json(populated);
}

// @desc Delete trainee
export async function DELETE(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  const trainee = await Trainee.findByIdAndDelete(id);
  if (!trainee)
    return new Response(JSON.stringify({ message: "Trainee not found" }), {
      status: 404,
    });

  return NextResponse.json({ message: "Trainee removed" }, { status: 204 });
}
