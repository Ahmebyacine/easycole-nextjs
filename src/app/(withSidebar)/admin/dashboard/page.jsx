"use client";

import BarChartTraineesInstitutions from "@/components/dashboard/bar-chart-trainees-institutions";
import BarChartTraineesInstitutionsTotal from "@/components/dashboard/bar-chart-trainees-institutions-total";
import StatCard from "@/components/state-card";
import useFetch from "@/hooks/use-fetch";
import { formatCurrencyDZD } from "@/utils/formatCurrency";
import {
  BadgeDollarSign,
  BanknoteArrowUp,
  BanknoteX,
  UserRound,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data, loading, error } = useFetch("/api/trainees/stats/month");

  const stats = [
    {
      title: "اجمالي المتدربين هذا الشهر",
      value: data?.traineeCount || 0,
      icon: UserRound,
      iconColor: "#00C951",
      bgColor: "bg-[#B9F8CF]",
    },
    {
      title: "اجمالي المداخيل الشهرية",
      value: formatCurrencyDZD(data?.totalPaid || 0),
      icon: BadgeDollarSign,
      iconColor: "#00A6F4",
      bgColor: "bg-[#A2F4FD]",
    },
    {
      title: "اجمالي التحويلات الشهرية",
      value: formatCurrencyDZD(
        data?.payments?.baridimob || 0 + data?.payments?.ccp || 0
      ),
      icon: BanknoteArrowUp,
      iconColor: "#FD9A00",
      bgColor: "bg-[#FEE685]",
    },
    {
      title: "المبالغ الغير مدفوعة هذا الشهر",
      value: formatCurrencyDZD(data?.totalUnpaid || 0),
      icon: BanknoteX,
      iconColor: "#FB2C36",
      bgColor: "bg-[#FFC9C9]",
    },
  ];
  return (
    <div className="bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* === Stats Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading || error
            ? Array(4)
                .fill(null)
                .map((_, idx) => (
                  <StatCard key={idx} loading={loading} error={error} />
                ))
            : stats.map((stat, idx) =>
                stat.to ? (
                  <Link href={stat.to} className="no-underline" key={idx}>
                    <StatCard stat={stat} />
                  </Link>
                ) : (
                  <StatCard key={idx} stat={stat} />
                )
              )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartTraineesInstitutions />
          <BarChartTraineesInstitutionsTotal />
        </div>
      </div>
    </div>
  );
}
