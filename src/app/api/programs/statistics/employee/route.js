import { NextResponse } from "next/server";
import Program from "@/models/Program";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import "@/lib/models";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "employee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findById(session.user.id).populate("institutions");

  const institutionIds = user.institutions.map(i => i._id);

  const programs = await Program.find({
    institution: { $in: institutionIds },
    end_date: { $gt: new Date() },
    isDeleted: false
  }).select('_id');

  const programIds = programs.map(p => p._id);

  // Aggregation pipeline for filtered programs
  const statistics = await Trainee.aggregate([
    {
      $match: {
        program: { $in: programIds }
      }
    },
    {
      $group: {
        _id: "$program",
        totalTrainees: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: { 
          $sum: { 
            $add: ["$inialTranche", "$secondTranche"] 
          }
        },
        totalUnpaid: { $sum: "$rest" }
      }
    },
    {
      $lookup: {
        from: "programs",
        localField: "_id",
        foreignField: "_id",
        as: "programDetails"
      }
    },
    { $unwind: "$programDetails" },
    {
      $lookup: {
        from: "courses",
        localField: "programDetails.course",
        foreignField: "_id",
        as: "courseDetails"
      }
    },
    { $unwind: "$courseDetails" },
    {
      $lookup: {
        from: "institutions",
        localField: "programDetails.institution",
        foreignField: "_id",
        as: "institutionDetails"
      }
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
          endDate: "$programDetails.end_date"
        },
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1
      }
    }
  ]);

  // Bulk update programs' financials
  const bulkOps = statistics.map(stat => ({
    updateOne: {
      filter: { _id: stat.program.id },
      update: {
        $set: {
          total_amount: stat.totalAmount,
          paid_amount: stat.totalPaid,
          unpaid_amount: stat.totalUnpaid
        }
      }
    }
  }));

  await Program.bulkWrite(bulkOps);

  return NextResponse.json(statistics);
}
