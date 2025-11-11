import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  if (isNaN(year) || year < 2000 || year > 2100)
    return NextResponse.json({ message: "Invalid year format" }, { status: 400 });

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const stats = await Trainee.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate }, program: { $exists: true } } },
    { $lookup: { from: "programs", localField: "program", foreignField: "_id", as: "program" } },
    { $unwind: "$program" },
    { $lookup: { from: "courses", localField: "program.course", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $addFields: { month: { $month: "$createdAt" } } },
    {
      $group: {
        _id: { courseId: "$course._id", month: "$month" },
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
        courseId: "$_id.courseId",
        month: "$_id.month",
        courseName: 1,
        totalTrainees: 1,
        totalAmount: 1,
        totalPaid: 1,
        totalUnpaid: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const allCourses = await Course.find().lean();
  const monthNames = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    name: new Date(year, i, 1).toLocaleString("en-US", { month: "long" }),
  }));

  const result = allCourses.map((course) => {
    const courseStats = stats.filter((s) => s.courseId.equals(course._id));
    const monthlyData = monthNames.map((m) => {
      const stat = courseStats.find((s) => s.month === m.month);
      return {
        month: m.name,
        totalTrainees: stat?.totalTrainees || 0,
        totalAmount: stat?.totalAmount || 0,
        totalPaid: stat?.totalPaid || 0,
        totalUnpaid: stat?.totalUnpaid || 0,
      };
    });

    return {
      course: {
        id: course._id,
        name: course.name,
        duration: course.duree,
        price: course.price,
      },
      yearlyTotal: {
        totalTrainees: courseStats.reduce((sum, s) => sum + s.totalTrainees, 0),
        totalAmount: courseStats.reduce((sum, s) => sum + s.totalAmount, 0),
        totalPaid: courseStats.reduce((sum, s) => sum + s.totalPaid, 0),
        totalUnpaid: courseStats.reduce((sum, s) => sum + s.totalUnpaid, 0),
      },
      monthlyData,
    };
  });

  return NextResponse.json({ year, statistics: result });
}
