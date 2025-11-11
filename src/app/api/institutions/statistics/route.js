import { connectDB } from "@/lib/mongodb";
import Institution from "@/models/Institution";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc get institutions statistics (admin only)
export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  if (isNaN(year) || year < 2000 || year > 2100)
    return NextResponse.json(
      { message: "Invalid year format" },
      { status: 400 }
    );

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const stats = await Trainee.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
        program: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "programs",
        localField: "program",
        foreignField: "_id",
        as: "program",
      },
    },
    { $unwind: "$program" },
    {
      $lookup: {
        from: "institutions",
        localField: "program.institution",
        foreignField: "_id",
        as: "institution",
      },
    },
    { $unwind: "$institution" },
    {
      $addFields: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: {
          institutionId: "$institution._id",
          month: "$month",
        },
        institutionName: { $first: "$institution.name" },
        totalTrainees: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: { $sum: { $add: ["$inialTranche", "$secondTranche"] } },
        totalUnpaid: { $sum: "$rest" },
      },
    },
    {
      $project: {
        _id: 0,
        institutionId: "$_id.institutionId",
        month: "$_id.month",
        institutionName: 1,
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const allInstitutions = await Institution.find().lean();
  const monthNames = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    name: new Date(year, i, 1).toLocaleString("en-US", { month: "long" }),
  }));

  const result = allInstitutions.map((institution) => {
    const institutionStats = stats.filter((s) =>
      s.institutionId.equals(institution._id)
    );

    const monthlyData = monthNames.map((m) => {
      const stat = institutionStats.find((s) => s.month === m.month);
      return {
        month: m.name,
        totalTrainees: stat?.totalTrainees || 0,
        totalAmount: stat?.totalAmount || 0,
        totalPaid: stat?.totalPaid || 0,
        totalUnpaid: stat?.totalUnpaid || 0,
      };
    });

    return {
      institution: {
        id: institution._id,
        name: institution.name,
        address: institution.address,
        phone: institution.phone,
      },
      yearlyTotal: {
        totalTrainees: institutionStats.reduce(
          (sum, s) => sum + s.totalTrainees,
          0
        ),
        totalAmount: institutionStats.reduce(
          (sum, s) => sum + s.totalAmount,
          0
        ),
        totalPaid: institutionStats.reduce((sum, s) => sum + s.totalPaid, 0),
        totalUnpaid: institutionStats.reduce(
          (sum, s) => sum + s.totalUnpaid,
          0
        ),
      },
      monthlyData,
    };
  });

  return NextResponse.json({ year, statistics: result });
}
