import { apiRequest } from "./client";
import type { AdminTeacher, AdminTeachersListResponse } from "./types";

export type GetAdminTeachersParams = {
  status?: string; // "Pending" | "Approved" | "Rejected" | ...
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