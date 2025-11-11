import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Trainee from "@/models/Trainee";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  if (!mongoose.Types.ObjectId.isValid(id))
    return new Response(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });

  const user = await User.findById(id);
  if (!user)
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

  const year = new Date().getFullYear();
  const stats = await Trainee.aggregate([
    {
      $match: {
        employee: new mongoose.Types.ObjectId(id),
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        totalPrice: 1,
        paid: { $add: ["$inialTranche", "$secondTranche"] },
        unpaid: "$rest",
      },
    },
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: { $sum: "$paid" },
        totalUnpaid: { $sum: "$unpaid" },
      },
    },
  ]);

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalAmount: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  }));

  stats.forEach((m) => {
    monthly[m._id - 1] = {
      month: m._id,
      totalAmount: m.totalAmount,
      totalPaid: m.totalPaid,
      totalUnpaid: m.totalUnpaid,
    };
  });

  return NextResponse.json({
    year,
    user: { id: user._id, name: user.name, email: user.email },
    statistics: monthly.map((m) => ({
      ...m,
      monthName: new Date(year, m.month - 1).toLocaleString("default", { month: "long" }),
    })),
  });
}
