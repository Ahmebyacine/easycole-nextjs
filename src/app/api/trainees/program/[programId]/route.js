import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Get all trainees by program ID
export async function GET(req, context) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { programId } = await context.params;

  const trainees = await Trainee.find({ program: programId })
    .sort({ createdAt: -1 })
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    })
    .exec();

  return NextResponse.json(trainees);
}
