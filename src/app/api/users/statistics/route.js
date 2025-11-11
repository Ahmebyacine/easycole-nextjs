import { NextResponse } from "next/server";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const stats = await Trainee.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
        employee: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "employee",
        foreignField: "_id",
        as: "employeeData",
      },
    },
    { $unwind: "$employeeData" },
    {
      $addFields: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: {
          employeeId: "$employeeData._id",
          month: "$month",
        },
        employeeName: { $first: "$employeeData.name" },
        totalTrainees: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: {
          $sum: { $add: ["$inialTranche", "$secondTranche"] },
        },
        totalUnpaid: { $sum: "$rest" },
        averagePayment: { $avg: { $add: ["$inialTranche", "$secondTranche"] } },
      },
    },
    {
      $project: {
        _id: 0,
        employeeId: "$_id.employeeId",
        month: "$_id.month",
        employeeName: 1,
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1,
        averagePayment: { $round: ["$averagePayment", 2] },
      },
    },
    { $sort: { month: 1 } },
  ]);

  // Get all employees with role 'employee'
  const allEmployees = await User.find({ role: "employee" }).lean();
  const monthNames = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    name: new Date(year, i, 1).toLocaleString("en-US", { month: "long" }),
  }));

  const result = allEmployees.map((employee) => {
    const employeeStats = stats.filter((s) =>
      s.employeeId.equals(employee._id)
    );

    const monthlyData = monthNames.map((m) => {
      const stat = employeeStats.find((s) => s.month === m.month);
      return {
        month: m.name,
        totalTrainees: stat?.totalTrainees || 0,
        totalAmount: stat?.totalAmount || 0,
        totalPaid: stat?.totalPaid || 0,
        totalUnpaid: stat?.totalUnpaid || 0,
        averagePayment: stat?.averagePayment || 0,
      };
    });

    return {
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
      },
      performance: {
        yearlyTotal: {
          totalTrainees: employeeStats.reduce(
            (sum, s) => sum + s.totalTrainees,
            0
          ),
          totalAmount: employeeStats.reduce((sum, s) => sum + s.totalAmount, 0),
          totalPaid: employeeStats.reduce((sum, s) => sum + s.totalPaid, 0),
          totalUnpaid: employeeStats.reduce((sum, s) => sum + s.totalUnpaid, 0),
          averagePayment:
            employeeStats.length > 0
              ? parseFloat(
                  (
                    employeeStats.reduce(
                      (sum, s) => sum + s.averagePayment,
                      0
                    ) / employeeStats.length
                  ).toFixed(2)
                )
              : 0,
        },
        monthlyData,
      },
    };
  });

  return NextResponse.json({
    year,
    statistics: result,
  });
}
