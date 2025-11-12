import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "@/lib/models";

// @desc Get all users (except admins)
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const users = await User.find({ role: { $ne: "admin" } }).populate(
    "institutions"
  );
  return NextResponse.json(users);
}

// @desc Add new user
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { name, email, password, phone, nationalId, institutions } =
      await req.json();

    if (!name || !email || !password || !phone || !nationalId) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { nationalId }] });
    if (existing)
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      nationalId,
      institutions: institutions || [],
    });

    const populated = await User.findById(user._id)
      .select("-password")
      .populate("institutions");

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
