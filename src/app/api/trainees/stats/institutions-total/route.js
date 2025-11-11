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

  // Aggregate totalPrice per institution
  const stats = await Trainee.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $lookup: {
        from: "programs",
        localField: "program",
        foreignField: "_id",
        as: "programData",
      },
    },
    { $unwind: "$programData" },
    {
      $lookup: {
        from: "institutions",
        localField: "programData.institution",
        foreignField: "_id",
        as: "institutionData",
      },
    },
    { $unwind: "$institutionData" },
    {
      $group: {
        _id: "$institutionData.name",
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        institution: "$_id",
        totalPrice: 1,
      },
    },
    { $sort: { totalPrice: -1 } },
  ]);

  return NextResponse.json(stats);
}
