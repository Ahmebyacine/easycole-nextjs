import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function WithoutSidebarLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <main>{children}</main>;
}
