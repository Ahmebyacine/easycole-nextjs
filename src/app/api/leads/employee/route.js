import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Program from "@/models/Program";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc get leads for user's institutions' future programs
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const institutionIds = session.user.institutions || [];
  const now = new Date();

  const futurePrograms = await Program.find({
    institution: { $in: institutionIds },
    start_date: { $gte: now },
  }).populate("course");

  const courseIds = futurePrograms.map((p) => p.course._id);

  const leads = await Lead.find({
    course: { $in: courseIds },
    createdAt: {
      $gte: futurePrograms.length ? futurePrograms[0].createdAt : now,
    },
  }).populate("course");

  return NextResponse.json(leads);
}
