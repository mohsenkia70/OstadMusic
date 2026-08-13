import { apiRequest } from "./client";
import type { AdminTeacher, AdminTeachersListResponse } from "./types";

// ✅ مقادیر واقعی که API قبول میکنه
export type ApprovalStatusFilter = 
  | "PendingReview" 
  | "Approved" 
  | "Rejected";

export type GetAdminTeachersParams = {
  status?: ApprovalStatusFilter;
  page?: number;
  pageSize?: number;
};

export function getAdminTeachers(params: GetAdminTeachersParams = {}) {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.page != null) query.set("page", String(params.page));
  if (params.pageSize != null) query.set("pageSize", String(params.pageSize));

  const qs = query.toString();
  return apiRequest<AdminTeachersListResponse>(
    `/admin/teachers${qs ? `?${qs}` : ""}`
  );
}

export function getAdminTeacherById(teacherProfileId: string) {
  return apiRequest<AdminTeacher>(`/admin/teachers/${teacherProfileId}`);
}

export function approveTeacher(teacherProfileId: string) {
  return apiRequest<unknown>(`/admin/teachers/${teacherProfileId}/approve`, {
    method: "POST",
  });
}

export function rejectTeacher(teacherProfileId: string, reason: string) {
  return apiRequest<unknown>(`/admin/teachers/${teacherProfileId}/reject`, {
    method: "POST",
    body: { reason },
  });
}