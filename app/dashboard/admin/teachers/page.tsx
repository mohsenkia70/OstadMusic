"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, XCircle, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAdminTeachers,
  getAdminTeacherById,
  approveTeacher,
  rejectTeacher,
} from "@/lib/api/admin-teachers";
import type { AdminTeacher } from "@/lib/api/types";

type StatusFilter = "All" | "PendingReview" | "Approved" | "Rejected";

function isPending(status: string) {
  return status?.toLowerCase() === "pendingreview";
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || "";

  if (s === "approved") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
        تأیید شده
      </Badge>
    );
  }
  if (s === "rejected") {
    return (
      <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
        رد شده
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
      در انتظار بررسی
    </Badge>
  );
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("PendingReview");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selected, setSelected] = useState<AdminTeacher | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<AdminTeacher | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAdminTeachers({
        status: statusFilter === "All" ? undefined : statusFilter,
        page,
        pageSize: 20,
      });

      setTeachers(res.items ?? []);
      setTotalPages(res.totalPages ?? 1);
      setTotalCount(res.totalCount ?? 0);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطا در دریافت لیست اساتید";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const openDetail = async (teacher: AdminTeacher) => {
    setSelected(teacher);
    setDetailLoading(true);
    try {
      const full = await getAdminTeacherById(teacher.teacherProfileId);
      setSelected(full);
    } catch (err) {
      console.error(err);
      // همون اطلاعات اولیه رو نشون میده
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (teacher: AdminTeacher) => {
    // ✅ از sonner confirm استفاده میکنیم
    toast(`آیا از تأیید «${teacher.fullName}» مطمئن هستید؟`, {
      action: {
        label: "بله، تأیید کن",
        onClick: () => confirmApprove(teacher),
      },
      cancel: {
        label: "انصراف",
        onClick: () => {},
      },
      duration: 6000,
    });
  };

  const confirmApprove = async (teacher: AdminTeacher) => {
    setActionLoading(true);
    const toastId = toast.loading(`در حال تأیید «${teacher.fullName}»...`);

    try {
      await approveTeacher(teacher.teacherProfileId);

      toast.success(`«${teacher.fullName}» با موفقیت تأیید شد.`, {
        id: toastId,
      });

      setSelected(null);
      setTeachers((prev) =>
        prev.filter((t) => t.teacherProfileId !== teacher.teacherProfileId),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "خطا در تأیید استاد";
      toast.error(message, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("لطفاً دلیل رد را وارد کنید.");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading(
      `در حال رد کردن «${rejectTarget.fullName}»...`,
    );

    try {
      await rejectTeacher(rejectTarget.teacherProfileId, rejectReason.trim());

      toast.success(`«${rejectTarget.fullName}» با موفقیت رد شد.`, {
        id: toastId,
      });

      setTeachers((prev) =>
        prev.filter(
          (t) => t.teacherProfileId !== rejectTarget.teacherProfileId,
        ),
      );
      setRejectTarget(null);
      setRejectReason("");
      setSelected(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطا در رد کردن استاد";
      toast.error(message, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const filterLabel: Record<StatusFilter, string> = {
    All: "همه",
    PendingReview: "در انتظار بررسی",
    Approved: "تأیید شده",
    Rejected: "رد شده",
  };

  return (
    <>
      <DashPageHeader
        title="مدیریت اساتید"
        desc="تأیید یا رد اساتید تازه‌ثبت‌نام‌شده"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {(
          ["All", "PendingReview", "Approved", "Rejected"] as StatusFilter[]
        ).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "gold" : "outline"}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
          >
            {filterLabel[s]}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          className="mr-auto"
          onClick={loadTeachers}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 ml-1 ${loading ? "animate-spin" : ""}`}
          />
          بروزرسانی
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center space-y-3">
          <p className="text-red-400">{error}</p>
          <Button size="sm" variant="outline" onClick={loadTeachers}>
            تلاش مجدد
          </Button>
        </div>
      ) : teachers.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
          استادی با این فیلتر یافت نشد.
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/20 text-muted">
                <tr>
                  <th className="text-right px-4 py-3 font-medium">نام</th>
                  <th className="text-right px-4 py-3 font-medium">ایمیل</th>
                  <th className="text-right px-4 py-3 font-medium">موبایل</th>
                  <th className="text-right px-4 py-3 font-medium">شهر</th>
                  <th className="text-right px-4 py-3 font-medium">سابقه</th>
                  <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                  <th className="text-right px-4 py-3 font-medium">
                    تاریخ ثبت
                  </th>
                  <th className="text-right px-4 py-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr
                    key={t.teacherProfileId}
                    className="border-t border-line hover:bg-black/10 transition"
                  >
                    <td className="px-4 py-3 font-medium">{t.fullName}</td>
                    <td className="px-4 py-3 text-muted">{t.email}</td>
                    <td className="px-4 py-3 text-muted">{t.phoneNumber}</td>
                    <td className="px-4 py-3">{t.city || "—"}</td>
                    <td className="px-4 py-3">{t.yearsOfExperience} سال</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.approvalStatus} />
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {t.registeredAtUtc
                        ? new Date(t.registeredAtUtc).toLocaleDateString(
                            "fa-IR",
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetail(t)}
                        >
                          <Eye className="h-3.5 w-3.5 ml-1" />
                          جزئیات
                        </Button>

                        {isPending(t.approvalStatus) && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={actionLoading}
                              onClick={() => handleApprove(t)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                              تأیید
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={actionLoading}
                              onClick={() => {
                                setRejectTarget(t);
                                setRejectReason("");
                              }}
                            >
                              <XCircle className="h-3.5 w-3.5 ml-1" />
                              رد
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-line text-sm text-muted">
              <span>
                صفحه {page} از {totalPages} (مجموع {totalCount} استاد)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  قبلی
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-surface border border-line rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">جزئیات استاد</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
              >
                بستن
              </Button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2.5 text-sm">
                  <div>
                    <span className="text-muted">نام:</span> {selected.fullName}
                  </div>
                  <div>
                    <span className="text-muted">ایمیل:</span> {selected.email}
                  </div>
                  <div>
                    <span className="text-muted">موبایل:</span>{" "}
                    {selected.phoneNumber}
                  </div>
                  <div>
                    <span className="text-muted">شهر / منطقه:</span>{" "}
                    {selected.city || "—"}
                    {selected.district ? ` - ${selected.district}` : ""}
                  </div>
                  <div>
                    <span className="text-muted">سابقه:</span>{" "}
                    {selected.yearsOfExperience} سال
                  </div>
                  <div>
                    <span className="text-muted">نرخ ساعتی:</span>{" "}
                    {selected.hourlyRate > 0
                      ? `${selected.hourlyRate.toLocaleString("fa-IR")} تومان`
                      : "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">وضعیت:</span>
                    <StatusBadge status={selected.approvalStatus} />
                  </div>

                  {selected.rejectionReason && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-xs">
                      <span className="font-medium">دلیل رد:</span>{" "}
                      {selected.rejectionReason}
                    </div>
                  )}

                  <div>
                    <span className="text-muted">بیوگرافی:</span>
                    <p className="mt-1 leading-relaxed text-foreground/80">
                      {selected.bio || "—"}
                    </p>
                  </div>

                  {selected.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selected.categories.map((c) => (
                        <Badge key={c} variant="gold">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {isPending(selected.approvalStatus) && (
                  <div className="flex gap-3 pt-4 border-t border-line">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={actionLoading}
                      onClick={() => handleApprove(selected)}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 ml-1" />
                          تأیید
                        </>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      disabled={actionLoading}
                      onClick={() => {
                        setRejectTarget(selected);
                        setRejectReason("");
                      }}
                    >
                      <XCircle className="h-4 w-4 ml-1" />
                      رد کردن
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-line rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">رد کردن استاد</h3>
            <p className="text-sm text-muted">
              در حال رد کردن:{" "}
              <strong className="text-foreground">
                {rejectTarget.fullName}
              </strong>
            </p>

            <div className="space-y-1.5">
              <Label>دلیل رد (الزامی)</Label>
              <Textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="دلیل رد را بنویسید..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                className="flex-1"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleReject}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "تأیید رد"
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
              >
                انصراف
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
