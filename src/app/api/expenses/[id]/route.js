import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const populateOptions = [
  { path: "employee", select: "name email" },
  {
    path: "program",
    populate: [{ path: "course" }, { path: "institution" }, { path: "trainer" }],
  },
];

//@desc GET single expense
export async function GET(req, { params }) {
  await connectDB();
  const expense = await Expense.findById(params.id).populate(populateOptions);
  if (!expense) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(expense);
}

//@desc UPDATE expense
export async function PUT(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const expense = await Expense.findByIdAndUpdate(params.id, body, { new: true });

  const populated = await Expense.findById(expense._id).populate(populateOptions);
  return NextResponse.json(populated);
}

//@desc DELETE expense (admin only)
export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  await Expense.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" }, { status: 204 });
}
