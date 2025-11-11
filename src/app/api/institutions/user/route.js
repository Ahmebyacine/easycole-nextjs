import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @desc GET /api/institutions/user → manager institutions
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await User.findById(session.user.id).populate("institutions");
  return NextResponse.json(user?.institutions || []);
}
