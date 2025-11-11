import Expense from "@/models/Expense";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

const expensePopulate = [
  { path: "employee", select: "name email" },
  {
    path: "program",
    populate: [{ path: "course" }, { path: "institution" }, { path: "trainer" }],
  },
];

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  const body = await req.json();
  const { title, program, amount, note } = body;

  const expense = await Expense.create({
    title,
    employee: session.user.id,
    program,
    amount,
    note,
  });

  const expensePopulated = await Expense.findById(expense._id).populate(expensePopulate);
  return NextResponse.json(expensePopulated, { status: 201 });
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const expenses = await Expense.find({})
    .sort({ createdAt: -1 })
    .populate(expensePopulate);

  return NextResponse.json(expenses);
}
