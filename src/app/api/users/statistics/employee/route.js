import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  // Check if user exists
  const user = await User.findById(session.user.id);
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Calculate first and last day of current month
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 1);

  // Get current month statistics
  const stats = await Trainee.aggregate([
    {
      $match: {
        employee: new mongoose.Types.ObjectId(session.user.id),
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      }
    },
    {
      $project: {
        totalPrice: 1,
        paid: { $add: ["$inialTranche", "$secondTranche"] },
        unpaid: "$rest"
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: { $sum: "$paid" },
        totalUnpaid: { $sum: "$unpaid" }
      }
    }
  ]);

  // Extract results or use defaults
  const monthlyStats = stats[0] || {
    totalAmount: 0,
    totalPaid: 0,
    totalUnpaid: 0
  };

    return NextResponse.json({
    year: currentYear,
    month: currentMonth,
    monthName: startOfMonth.toLocaleString('en-US', { month: 'long' }),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    statistics: {
      totalAmount: monthlyStats.totalAmount,
      totalPaid: monthlyStats.totalPaid,
      totalUnpaid: monthlyStats.totalUnpaid
    }
  });
}
