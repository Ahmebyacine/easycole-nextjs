import { NextResponse } from "next/server";
import Program from "@/models/Program";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";

//@desc get overall statistics for programs
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const statistics = await Trainee.aggregate([
    {
      $group: {
        _id: "$program",
        totalTrainees: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: {
          $sum: {
            $add: ["$inialTranche", "$secondTranche"],
          },
        },
        totalUnpaid: { $sum: "$rest" },
      },
    },
    {
      $lookup: {
        from: "programs",
        let: { programId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$programId"] },
              isDeleted: false,
            },
          },
        ],
        as: "programDetails",
      },
    },
    { $unwind: "$programDetails" },
    {
      $lookup: {
        from: "courses",
        localField: "programDetails.course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    { $unwind: "$courseDetails" },
    {
      $lookup: {
        from: "institutions",
        localField: "programDetails.institution",
        foreignField: "_id",
        as: "institutionDetails",
      },
    },
    { $unwind: "$institutionDetails" },
    {
      $project: {
        _id: 0,
        program: {
          id: "$_id",
          courseName: "$courseDetails.name",
          institutionName: "$institutionDetails.name",
          startDate: "$programDetails.start_date",
          endDate: "$programDetails.end_date",
        },
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1,
      },
    },
  ]);

  // Update all programs' financials in bulk
  const bulkOps = statistics.map((stat) => ({
    updateOne: {
      filter: { _id: stat.program.id },
      update: {
        $set: {
          total_amount: stat.totalAmount,
          paid_amount: stat.totalPaid,
          unpaid_amount: stat.totalUnpaid,
        },
      },
    },
  }));

  await Program.bulkWrite(bulkOps);

  return NextResponse.json(statistics);
}
