import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/courses → create course
export async function POST(req) {
  await connectDB();
  const { name, price, duree } = await req.json();

  const course = await Course.create({ name, price, duree });
  return NextResponse.json(course, { status: 201 });
}

// GET /api/courses → list courses
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const courses = await Course.find({});
  return NextResponse.json(courses);
}
