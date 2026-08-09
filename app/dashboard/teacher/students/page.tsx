import { MessageCircle } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { teacherStudents } from "@/lib/data";

export default function TeacherStudentsPage() {
  return (
    <>
      <DashPageHeader title="هنرجوان" desc="فهرست هنرجوان فعلی‌ات و وضعیت پیشرفت هرکدام." />

      <div className="rounded-2xl border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-muted text-xs">
              <th className="text-start font-medium px-5 py-3.5">نام</th>
              <th className="text-start font-medium px-5 py-3.5">سطح</th>
              <th className="text-start font-medium px-5 py-3.5">جلسات برگزارشده</th>
              <th className="text-start font-medium px-5 py-3.5">جلسه‌ی بعدی</th>
              <th className="text-start font-medium px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {teacherStudents.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-5 py-4 font-medium">{s.name}</td>
                <td className="px-5 py-4">
                  <Badge variant="neutral">{s.level}</Badge>
                </td>
                <td className="px-5 py-4 text-muted">{s.sessionsDone.toLocaleString("fa-IR")}</td>
                <td className="px-5 py-4 text-muted">{s.nextSession}</td>
                <td className="px-5 py-4">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" /> پیام
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
