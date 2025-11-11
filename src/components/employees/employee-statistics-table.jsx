import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyDZD } from "@/utils/formatCurrency";

export default function EmployeeStatisticsTable({ statistics, type = "yearly", showTotal = false }) {
  const normalized = statistics.map((stat) => {
    if (type === "yearly") {
      return {
        id: stat.employee?._id,
        name: stat.employee?.name || "غير معروف",
        totalTrainees: stat?.performance?.yearlyTotal?.totalTrainees || 0,
        totalAmount: stat?.performance?.yearlyTotal?.totalAmount || 0,
        totalPaid: stat?.performance?.yearlyTotal?.totalPaid || 0,
        totalUnpaid: stat?.performance?.yearlyTotal?.totalUnpaid || 0,
      };
    }
    return {
      id: stat.employee?._id,
      name: stat.employee?.name || "غير معروف",
      totalTrainees: stat.totalTrainees || 0,
      totalAmount: stat.totalAmount || 0,
      totalPaid: stat.totalPaid || 0,
      totalUnpaid: stat.totalUnpaid || 0,
    };
  });

  const totals = showTotal
    ? {
        totalTrainees: normalized.reduce((a, b) => a + b.totalTrainees, 0),
        totalAmount: normalized.reduce((a, b) => a + b.totalAmount, 0),
        totalPaid: normalized.reduce((a, b) => a + b.totalPaid, 0),
        totalUnpaid: normalized.reduce((a, b) => a + b.totalUnpaid, 0),
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "yearly" ? "الجدول السنوي" : "الجدول الشهري"}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead>الموظف</TableHead>
              <TableHead>عدد المتدربين</TableHead>
              <TableHead>المبلغ الإجمالي</TableHead>
              <TableHead>المدفوع</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>نسبة الدفع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {normalized.map((stat, i) => {
              const ratio = stat.totalAmount
                ? ((stat.totalPaid / stat.totalAmount) * 100).toFixed(1)
                : 0;
              return (
                <TableRow key={i}>
                  <TableCell>{stat.name}</TableCell>
                  <TableCell>{stat.totalTrainees}</TableCell>
                  <TableCell>{formatCurrencyDZD(stat.totalAmount)}</TableCell>
                  <TableCell>{formatCurrencyDZD(stat.totalPaid)}</TableCell>
                  <TableCell>{formatCurrencyDZD(stat.totalUnpaid)}</TableCell>
                  <TableCell>{ratio}%</TableCell>
                </TableRow>
              );
            })}
            {showTotal && (
              <TableRow className="font-semibold bg-muted/40">
                <TableCell>المجموع</TableCell>
                <TableCell>{totals.totalTrainees}</TableCell>
                <TableCell>{formatCurrencyDZD(totals.totalAmount)}</TableCell>
                <TableCell>{formatCurrencyDZD(totals.totalPaid)}</TableCell>
                <TableCell>{formatCurrencyDZD(totals.totalUnpaid)}</TableCell>
                <TableCell>
                  {totals.totalAmount
                    ? ((totals.totalPaid / totals.totalAmount) * 100).toFixed(1)
                    : 0}
                  %
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
