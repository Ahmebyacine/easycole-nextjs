import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Whitelist from "@/models/Whitelist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc Get single whitelist by ID
export async function GET(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const whitelist = await Whitelist.findById(params.id)
    .sort({ createdAt: -1 })
    .populate("employee")
    .populate({
      path: "program",
      populate: [
        { path: "course" },
        { path: "institution" },
        { path: "trainer" },
      ],
    });

  if (!whitelist) {
    return new Response(JSON.stringify({ message: "Whitelist not found" }), {
      status: 404,
    });
  }

  return NextResponse.json(whitelist);
}

// @desc Update whitelist
export async function PUT(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { name, phone, program, status, note } = await req.json();

  const whitelist = await Whitelist.findByIdAndUpdate(
    params.id,
    { name, phone, program, status, note },
    { new: true, runValidators: true }
  );

  if (!whitelist) {
    return new Response(JSON.stringify({ message: "Whitelist not found" }), {
      status: 404,
    });
  }

  const whitelistPopulate = await Whitelist.findById(whitelist._id)
    .populate("employee")
    .populate({
      path: "program",
      populate: [{ path: "course" }, { path: "institution" }],
    });

  return NextResponse.json(whitelistPopulate);
}

// @desc Delete whitelist
export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const whitelist = await Whitelist.findByIdAndDelete(params.id);
  if (!whitelist) {
    return new Response(JSON.stringify({ message: "Whitelist not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: "Whitelist removed" }), {
    status: 204,
  });
}
