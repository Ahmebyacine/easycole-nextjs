import { NextResponse } from "next/server";
import Program from "@/models/Program";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "employee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findById(session.user.id).populate("institutions");

  const institutionIds = user.institutions.map((i) => i._id);

  const stats = await Program.aggregate([
    { $match: { institution: { $in: institutionIds }, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalPrograms: { $sum: 1 },
        totalPaid: { $sum: "$paid_amount" },
        totalUnpaid: { $sum: "$unpaid_amount" },
      },
    },
  ]);

  return NextResponse.json(stats[0] || {});
}
