import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const trainees = await Trainee.find({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  })
    .populate({
      path: "program",
      populate: { path: "institution" },
    });

  // Transform data to array of objects
  const statsMap = {};
  trainees.forEach((trainee) => {
    if (!trainee.program || !trainee.program.institution) return;

    const name = trainee.program.institution.name;
    statsMap[name] = (statsMap[name] || 0) + 1;
  });

  const statsArray = Object.entries(statsMap).map(([institution, count]) => ({
    institution,
    count,
  }));

  return NextResponse.json(statsArray);
}
