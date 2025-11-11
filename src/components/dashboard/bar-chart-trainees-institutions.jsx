import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ChartBar, TriangleAlert } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

export default function BarChartTraineesInstitutions() {
  const { data, loading, error } = useFetch("/api/trainees/stats/institutions");
  const chartConfig = {
    count: {
      label: "إجمالي المتدربين",
      color: "var(--chart-2)",
    },
  };
  return (
    <Card className="gap-3 h-full" dir="ltr">
      <CardHeader>
        <CardTitle className="rtl:text-right text-foreground">
          احصائيات المتدربين حسب المؤسسة
        </CardTitle>
      </CardHeader>
      {error ? (
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full text-destructive bg-muted">
              <TriangleAlert size={36} color="currentColor" />
              <h3 className="text-lg font-medium text-destructive">
                {error?.status}
              </h3>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-destructive">خطأ</h3>
              <p className="text-sm text-destructive max-w-sm">
                حدث خطأ اثناء تحميل البيانات
              </p>
            </div>
          </div>
        </CardContent>
      ) : loading ? (
        <div className="space-y-4 mx-4">
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-70 w-full rounded-xl" />
          <div className="flex space-x-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ) : data?.length === 0 ? (
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full text-muted-foreground bg-muted">
              <ChartBar size={36} color="currentColor" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                لا توجد بيانات
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                لا توجد بيانات ليتم عرضها
              </p>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="px-0 overflow-x-auto">
            <ChartContainer config={chartConfig} className="h-full w-full min-w-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="institution" />
                  <YAxis />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-3)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
}
