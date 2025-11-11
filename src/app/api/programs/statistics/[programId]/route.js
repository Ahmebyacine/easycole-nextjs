import { NextResponse } from "next/server";
import Program from "@/models/Program";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

//@desc Get statistics for a specific program
export async function GET(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }
  const { programId } = params;

  const program = await Program.findById(programId).populate("course institution trainer");
  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

  const stats = {
    totalAmount: program.total_amount,
    paid: program.paid_amount,
    unpaid: program.unpaid_amount,
  };

  return NextResponse.json(stats);
}
