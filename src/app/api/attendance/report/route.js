import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import "@/lib/models";
import { generateAttendanceReportPDF } from "@/lib/pdf/attendanceReport";

const calcWorkedHours = (checkIn, checkOut, date) => {
  if (!checkIn || !checkOut) return "00:00";

  const inTime = new Date(`${date}T${checkIn}`);
  const outTime = new Date(`${date}T${checkOut}`);
  const totalMinutes = Math.max(0, (outTime - inTime) / (1000 * 60));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// Convert "HH:MM" string to total minutes (number)
const timeToMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Convert total minutes back to "HH:MM" string
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

function getDailySummary(records, date) {
  let checkIn = null;
  let checkOut = null;

  for (const record of records) {
    const { timestamp, status } = record;

    if (status === "0") {
      if (!checkIn || timestamp < checkIn) checkIn = timestamp;
    } else if (status === "1") {
      if (!checkOut || timestamp > checkOut) checkOut = timestamp;
    }
  }

  const workedHours = calcWorkedHours(checkIn, checkOut, date);
  return { checkIn, checkOut, workedHours };
}

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");

    if (!userId || !month || !/^\d{4}-\d{2}$/.test(month)) {
      return new Response(
        JSON.stringify({ message: "Missing userId or invalid month" }),
        { status: 400 },
      );
    }

    const monthReg = new RegExp(`^${month}-\\d{2}$`);
    const records = await Attendance.find({
      userId,
      date: { $regex: monthReg },
    }).lean();

    const user = await User.findOne(
      { attendanceId: userId },
      { attendanceId: 1, name: 1 },
    ).lean();

    // Group records by date
    const dateMap = {};
    records.forEach((rec) => {
      dateMap[rec.date] = dateMap[rec.date] || [];
      dateMap[rec.date].push(rec);
    });

    const rows = Object.keys(dateMap)
      .sort()
      .map((date) => {
        const { checkIn, checkOut, workedHours } = getDailySummary(
          dateMap[date],
          date,
        );
        return { date, checkIn, checkOut, workedHours };
      });

    // ✅ Sum all workedHours as minutes, then convert back to "HH:MM"
    const totalMinutes = rows.reduce(
      (sum, row) => sum + timeToMinutes(row.workedHours),
      0,
    );
    const totalHours = minutesToTime(totalMinutes);

    const pdfBuffer = await generateAttendanceReportPDF({
      userId,
      name: user ? user.name : userId,
      month,
      rows,
      totalHours,
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="attendance-${userId}-${month}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}