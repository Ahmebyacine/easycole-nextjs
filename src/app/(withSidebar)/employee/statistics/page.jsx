"use client";

import StatisticsCard from "@/components/employees/statistics-card";
import useFetch from "@/hooks/use-fetch";

export default function UserStatistics() {
  const {
    data: userData,
    loading,
    error,
  } = useFetch("/api/users/statistics/employee");

  // Loading UI
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">جاري تحميل إحصائيات المستخدم...</div>
      </div>
    );
  }

  // Error UI
  //if (error) return <ErrorPage error={error} />;
  return (
    <div className="container mx-auto md:px-10 px-3">
      <div className="space-y-4">
        <StatisticsCard key={userData.user._id} data={userData} />
      </div>
    </div>
  );
}
