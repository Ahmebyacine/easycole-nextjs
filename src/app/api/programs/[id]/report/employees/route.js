import { NextResponse } from "next/server";
import Employee from "@/models/Employee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

export async function GET(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }
  const { id } = params;

  const employees = await Employee.find({ program: id, isDeleted: false }).populate("program");
  return NextResponse.json(employees);
}
