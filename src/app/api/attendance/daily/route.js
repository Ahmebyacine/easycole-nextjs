import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import "@/lib/models";


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
    const date = searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(
        JSON.stringify({ message: "Invalid or missing date" }),
        { status: 400 },
      );
    }

    const records = await Attendance.find({ date }).lean();
    const userIds = [...new Set(records.map((r) => r.userId))];
    const users = await User.find(
      { attendanceId: { $in: userIds } },
      { attendanceId: 1, name: 1 },
    ).lean();
    const userMap = Object.fromEntries(users.map((u) => [u.attendanceId, u.name]));
    const grouped = {};

    for (const record of records) {
      const { userId, timestamp, status } = record;

      if (!grouped[userId]) {
        grouped[userId] = { userId, checkIn: null, checkOut: null };
      }

      if (status === "0") {
        // Keep the earliest check-in
        if (!grouped[userId].checkIn || timestamp < grouped[userId].checkIn) {
          grouped[userId].checkIn = timestamp;
        }
      } else if (status === "1") {
        // Keep the latest check-out
        if (!grouped[userId].checkOut || timestamp > grouped[userId].checkOut) {
          grouped[userId].checkOut = timestamp;
        }
      }
    }

    // Calculate worked hours for each user
    const dailyData = Object.values(grouped).map((entry) => {
      let workedHours = 0;

      if (entry.checkIn && entry.checkOut) {
        const inTime = new Date(`${date}T${entry.checkIn}`);
        const outTime = new Date(`${date}T${entry.checkOut}`);
        workedHours = Math.max(0, (outTime - inTime) / (1000 * 60 * 60));
      }

      return {
        userId: entry.userId,
        name: userMap[entry.userId] || entry.userId,
        checkIn: entry.checkIn,
        checkOut: entry.checkOut,
        workedHours,
      };
    });
    return NextResponse.json(dailyData);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendance" },
      { status: 500 },
    );
  }
}
