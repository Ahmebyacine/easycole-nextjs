import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TriangleAlert } from "lucide-react";

export default function StatCard({ stat, loading = false, error = null }) {
  return (
    <Card className="py-2 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
      <CardContent className="p-6">
        {error ? (
          <div className="text-center text-destructive text-sm min-w-[140px]">
            <TriangleAlert size="32" color="currentColor" className="mx-auto" />
            <p className="mb-2">
                حدث خطأ اثناء التحميل
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1 min-w-[140px]">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="w-10 h-10 rounded-xl" />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div
                    className={`min-w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon color={stat.iconColor} />
                  </div>
                </>
              )}
            </div>

            <div className="rtl:text-right mt-1">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-20 mb-2 ml-auto" />
                  <Skeleton className="h-3 w-32 ml-auto" />
                </>
              ) : (
                <>
                  <p className="text-[22px] font-bold text-foreground">
                    {stat.value}
                  </p>
                  {stat.subLabel && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {stat.subLabel}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}