import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainee from "@/models/Trainee";

export async function POST(req) {
  await connectDB();
  const { id } = await req.json();

  const cleaned = id.replace(/\D/g, "");
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { $or: [{ phone: id }, { phone: { $regex: cleaned, $options: "i" } }] };

  const trainee = await Trainee.findOne(query)
    .populate("employee")
    .populate({
      path: "program",
      populate: [{ path: "course" }, { path: "institution" }, { path: "trainer" }],
    });

  if (!trainee) return new Response(JSON.stringify({ message: "Trainee not found" }), { status: 404 });
  return NextResponse.json(trainee);
}
