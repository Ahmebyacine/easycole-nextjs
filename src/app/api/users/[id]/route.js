import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Get user by ID
export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });

  const user = await User.findById(id).populate("institutions");
  if (!user)
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });

  const result = user.toObject();
  delete result.password;
  return NextResponse.json(result);
}

// @desc Update user
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });

  const { password, ...data } = await req.json();
  const user = await User.findById(id);
  if (!user)
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });

  if (password) data.password = await bcrypt.hash(password, 10);
  Object.assign(user, data);
  await user.save();

  const populated = await User.findById(user._id)
    .select("-password")
    .populate("institutions");
  return NextResponse.json(populated);
}

// @desc Delete user
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });

  const user = await User.findByIdAndDelete(id);
  if (!user)
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });

  return NextResponse.json({ message: "User deleted" });
}
