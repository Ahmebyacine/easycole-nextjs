import { NextResponse } from "next/server";
import Program from "@/models/Program";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "manager") {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  const user = await User.findById(session.user.id)
    .populate("institutions")
    .select("institutions");

  const institutionIds = user.institutions.map((inst) => inst._id);

  const programs = await Program.find({
    isDeleted: false,
    institution: { $in: institutionIds },
  })
    .populate("course institution trainer")
    .sort({ start_date: -1 });

  return NextResponse.json(programs);
}
