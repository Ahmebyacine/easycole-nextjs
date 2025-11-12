import { NextResponse } from "next/server";
import Program from "@/models/Program";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Trainee from "@/models/Trainee";
import "@/lib/models";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const program = await Program.findById(id).populate("course institution trainer");
  if (!program)
    return NextResponse.json({ error: "Program not found" }, { status: 404 });

  // Fetch trainees for the specific program
  const trainees = await Trainee.find({ program: id })
    .populate("employee", "name email")
    .lean();

  const employeesMap = {};
  const programSummary = {
    totalPaid: 0,
    totalUnpaid: 0,
    totalPrice: 0,
    totalTrainees: trainees.length,
  };

  trainees.forEach((trainee) => {
    const employee = trainee.employee;
    if (!employee) return;

    const employeeId = employee._id.toString();

    if (!employeesMap[employeeId]) {
      employeesMap[employeeId] = {
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
        },
        trainees: [],
        summary: {
          totalPaid: 0,
          totalUnpaid: 0,
          totalPrice: 0,
          totalTrainees: 0,
        },
      };
    }

    // Calculate payments
    const paid = (trainee.inialTranche || 0) + (trainee.secondTranche || 0);
    const unpaid = trainee.rest || 0;
    const totalPrice = trainee.totalPrice || 0;

    // Add trainee data
    employeesMap[employeeId].trainees.push({
      id: trainee._id,
      name: trainee.name,
      email: trainee.email,
      phone: trainee.phone,
      paidAmount: paid,
      unpaidAmount: unpaid,
      totalPrice: totalPrice,
      note: trainee.note,
    });

    // Update employee summary
    employeesMap[employeeId].summary.totalPaid += paid;
    employeesMap[employeeId].summary.totalUnpaid += unpaid;
    employeesMap[employeeId].summary.totalPrice += totalPrice;
    employeesMap[employeeId].summary.totalTrainees += 1;

    // Update program summary
    programSummary.totalPaid += paid;
    programSummary.totalUnpaid += unpaid;
    programSummary.totalPrice += totalPrice;
  });

  const employees = Object.values(employeesMap);

  return NextResponse.json({
    program: {
      id: program._id,
      name: program.course.name,
      institution: program.institution.name,
      trainer: program.trainer?.name || "N/A",
      start_date: program.start_date,
      end_date: program.end_date,
    },
    employees,
    summary: programSummary,
  });
}
