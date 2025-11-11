import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Get first and last day of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const trainees = await Trainee.find({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const stats = {
    traineeCount: trainees.length,
    totalPaid: 0,
    totalUnpaid: 0,
    payments: {
      cash: 0,
      baridimob: 0,
      ccp: 0,
    },
  };

  for (const trainee of trainees) {
    const inial = trainee.inialTranche || 0;
    const second = trainee.secondTranche || 0;
    const rest = trainee.rest || 0;
    const method1 = trainee.methodePaiement1 || "";
    const method2 = trainee.methodePaiement2 || "";

    // total paid & unpaid
    stats.totalPaid += inial + second;
    stats.totalUnpaid += rest;

    // distribute first tranche
    if (["cash", "baridimob", "ccp"].includes(method1)) {
      stats.payments[method1] += inial;
    }

    // distribute second tranche
    if (["cash", "baridimob", "ccp"].includes(method2)) {
      stats.payments[method2] += second;
    }
  }

  return NextResponse.json(stats);
}
