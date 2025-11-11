import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  if (isNaN(year) || year < 2000 || year > 2100) {
    return NextResponse.json({ message: "Invalid year format" }, { status: 400 });
  }

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const stats = await Trainee.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate }, program: { $exists: true, $not: { $size: 0 } } } },
    { $unwind: "$program" },
    { $lookup: { from: "programs", localField: "program", foreignField: "_id", as: "program" } },
    { $unwind: "$program" },
    { $lookup: { from: "courses", localField: "program.course", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    {
      $group: {
        _id: "$course._id",
        courseName: { $first: "$course.name" },
        totalTrainees: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
        totalPaid: { $sum: { $add: ["$inialTranche", "$secondTranche"] } },
        totalUnpaid: { $sum: "$rest" },
      },
    },
    {
      $project: {
        _id: 0,
        course: { id: "$_id", name: "$courseName" },
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1,
      },
    },
  ]);

  const allCourses = await Course.find().lean();
  const result = allCourses.map((course) => {
    const stat = stats.find((s) => s.course.id.equals(course._id));
    return (
      stat || {
        course: { id: course._id, name: course.name },
        totalTrainees: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalUnpaid: 0,
      }
    );
  });

  return NextResponse.json({ year, statistics: result });
}
