"use client";

import Link from "next/link";
import {
  Calendar,
  BookOpen,
  Building2,
  Users,
  Contact,
  ChartBarStacked,
  BookCheck,
  GraduationCap,
  FileClock,
  FileCheck,
  LayoutDashboard,
  Search,
  ChevronDown,
  LogOut,
  Loader,
  EllipsisVertical,
  LoaderIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Define items by role
const navItemsByRole = {
  admin: [
    { title: "لوحة التحكم", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "البرامج", url: "/admin/programs", icon: Calendar },
    { title: "الدورات", url: "/admin/courses", icon: BookOpen },
    { title: "المؤسسات", url: "/admin/institutions", icon: Building2 },
    { title: "المستخدمين", url: "/admin/users", icon: Users },
    { title: "المدربين", url: "/admin/trainers", icon: Contact },
  ],
  manager: [
    { title: "البرامج", url: "/manager/programs", icon: Calendar },
    { title: "الدورات", url: "/manager/courses", icon: BookOpen },
    { title: "المؤسسات", url: "/manager/institutions", icon: Building2 },
    {
      title: "احصائيات البرامج",
      url: "/manager/statistics/programs",
      icon: Calendar,
    },
    {
      title: "احصائيات الموظفين",
      url: "/manager/statistics/employees",
      icon: Users,
    },
  ],
  employee: [
    { title: "إضافة متدرب", url: "/employee/add-trainee", icon: Users },
    { title: "بحث عن المتدرب", url: "/employee/search", icon: Search },
    { title: "قيد التسجيل", url: "/employee/whitelist", icon: LoaderIcon },
    { title: "متدربون محتملون", url: "/employee/lead", icon: Contact },
    {
    title: "إحصائيات البرامج",
    url: "/employee/statistics/programs",
    icon: Calendar,
  },
    { title: "إحصائيات", url: "/employee/statistics", icon: ChartBarStacked },
  ],
  member: [
    //{ title: "شهادة مطابقة", url: "/certificat-conformite", icon: BookCheck },
    {
      title: "شهادة التدريب",
      url: "/member/certificats/formation",
      icon: GraduationCap,
    },
    { title: "شهادة الكفاءة", url: "/member/certificats/aptitude", icon: FileClock },
    {
      title: "شهادة التدريب (سنة واحدة)",
      url: "/member/certificats/formation-duree",
      icon: FileCheck,
    },
  ],
};

const navItemsAdminStatistics = [
  {
    title: "إحصائيات البرامج",
    href: "/admin/statistics/programs",
    icon: Calendar,
  },
  {
    title: "إحصائيات الدورات",
    href: "/admin/statistics/courses",
    icon: Calendar,
  },
  {
    title: "إحصائيات المؤسسات",
    href: "/admin/statistics/institutions",
    icon: Building2,
  },
  {
    title: "إحصائيات الموظفين",
    href: "/admin/statistics/employees",
    icon: Users,
  },
];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  // extract user role from session (adjust if your session stores it differently)
  const role = session?.user?.role || "employee";
  const items = navItemsByRole[role] || [];

  return (
    <Sidebar side="right">
      <SidebarHeader>Easycole</SidebarHeader>

      {status === "loading" ? (
        <div className="h-full p-4 flex justify-center items-center">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {role === "admin" && (
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex items-center justify-between w-full cursor-pointer">
                          الإحصائيات
                          <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {navItemsAdminStatistics.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === item.href}
                                >
                                  <Link href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}

      {/* ✅ Footer Card with logout + user info */}
      {session?.user && (
        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem className="border-border border-2 rounded-lg">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" asChild>
                    <div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                      <EllipsisVertical />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-(--radix-popper-anchor-width) rounded-lg"
                >
                  <DropdownMenuItem className="p-0">
                    <Button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4 text-foreground-accant" />
                      <span>تسجيل الخروج</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
