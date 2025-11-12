import { NextResponse } from "next/server";
import Program from "@/models/Program";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import "@/lib/models";

//@desc Get all programs
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }
  const programs = await Program.find({ isDeleted: false }).populate(
    "course institution trainer"
  );
  return NextResponse.json(programs);
}

//@desc Create a new program
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  const body = await req.json();
  const { course, institution, trainer, start_date, end_date } = body;

  const program = await Program.create({
    course,
    institution,
    trainer,
    start_date,
    end_date,
  });

  const populated = await Program.findById(program._id).populate(
    "course institution trainer"
  );

  return NextResponse.json(populated, { status: 201 });
}
