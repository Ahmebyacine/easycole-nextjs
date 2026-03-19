import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import "@/lib/models";

const calcWorkedHours = (checkIn, checkOut, date) => {
  if (!checkIn || !checkOut) return 0;
  const inTime = new Date(`${date}T${checkIn}`);
  const outTime = new Date(`${date}T${checkOut}`);
  const hours = Math.max(0, (outTime - inTime) / (1000 * 60 * 60));
  return Number(hours.toFixed(2));
};

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return new Response(
        JSON.stringify({ message: "Invalid or missing month" }),
        { status: 400 },
      );
    }

    const monthReg = new RegExp(`^${month}-\\d{2}$`);
    const records = await Attendance.find({ date: { $regex: monthReg } }).lean();
    const userIds = [...new Set(records.map((r) => r.userId))];
    const users = await User.find(
      { attendanceId: { $in: userIds } },
      { attendanceId: 1, name: 1 },
    ).lean();
    const userMap = Object.fromEntries(users.map((u) => [u.attendanceId, u.name]));

    // Group by userId → date → { checkIn, checkOut }
    const groupedByUser = {};

    for (const record of records) {
      const { userId, timestamp, status, date } = record;

      groupedByUser[userId] = groupedByUser[userId] || {};
      groupedByUser[userId][date] = groupedByUser[userId][date] || {
        checkIn: null,
        checkOut: null,
        date,
      };

      if (status === "0") {
        // Keep earliest check-in
        if (
          !groupedByUser[userId][date].checkIn ||
          timestamp < groupedByUser[userId][date].checkIn
        ) {
          groupedByUser[userId][date].checkIn = timestamp;
        }
      } else if (status === "1") {
        // Keep latest check-out
        if (
          !groupedByUser[userId][date].checkOut ||
          timestamp > groupedByUser[userId][date].checkOut
        ) {
          groupedByUser[userId][date].checkOut = timestamp;
        }
      }
    }

    // Aggregate totals per user
    const result = Object.entries(groupedByUser).map(([userId, dates]) => {
      let totalDaysWorked = 0;
      let totalHoursWorked = 0;

      Object.values(dates).forEach(({ checkIn, checkOut, date }) => {
        const hours = calcWorkedHours(checkIn, checkOut, date);
        if (hours > 0) {
          totalDaysWorked += 1;
          totalHoursWorked += hours;
        }
      });

      return {
        userId,
        name: userMap[userId] || userId,
        totalDaysWorked,
        totalHoursWorked: Number(totalHoursWorked.toFixed(2)),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendance" },
      { status: 500 },
    );
  }
}