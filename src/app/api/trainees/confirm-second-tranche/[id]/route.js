import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "@/lib/models";

export async function PATCH(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  // Find trainee
  const trainee = await Trainee.findById(id);
  if (!trainee) {
    return NextResponse.json({ message: "المتربص غير موجود" }, { status: 404 });
  }

  // Update payment fields
  trainee.secondTranche = trainee.rest || 0;
  trainee.rest = 0;
  trainee.methodePaiement2 = "cash";

  await trainee.save();

  // Populate updated trainee
  const updated = await Trainee.findById(id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  return NextResponse.json(updated, { status: 200 });
}
