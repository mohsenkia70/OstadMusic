import { apiRequest } from "./client";
import type {
  TeacherDetail,
  TeachersListResponse,
  TeacherLocationPayload,
} from "./types";

export type GetTeachersParams = {
  search?: string;
  city?: string;
  district?: string;
  musicCategoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  minExperienceYears?: number;
  onlyVerified?: boolean;
  sortBy?: number | "NearestFirst" | string;
  page?: number;
  pageSize?: number;
  // موقعیت
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
};

export function getTeachers(params: GetTeachersParams = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set("Search", params.search);
  if (params.city) query.set("City", params.city);
  if (params.district) query.set("District", params.district);
  if (params.minPrice != null) query.set("MinPrice", String(params.minPrice));
  if (params.maxPrice != null) query.set("MaxPrice", String(params.maxPrice));
  if (params.minExperienceYears != null)
    query.set("MinExperienceYears", String(params.minExperienceYears));
  if (params.onlyVerified != null)
    query.set("OnlyVerified", String(params.onlyVerified));
  if (params.sortBy != null) query.set("SortBy", String(params.sortBy));
  if (params.page != null) query.set("Page", String(params.page));
  if (params.pageSize != null) query.set("PageSize", String(params.pageSize));

  if (params.musicCategoryIds?.length) {
    params.musicCategoryIds.forEach((id) =>
      query.append("MusicCategoryIds", String(id))
    );
  }


  if (params.latitude != null) query.set("latitude", String(params.latitude));
  if (params.longitude != null) query.set("longitude", String(params.longitude));
  if (params.radiusKm != null) query.set("radiusKm", String(params.radiusKm));

  const qs = query.toString();
  return apiRequest<TeachersListResponse>(
    `/teachers${qs ? `?${qs}` : ""}`,
    { auth: false }
  );
}

export function getTeacherById(id: string) {
  return apiRequest<TeacherDetail>(`/teachers/${id}`, { auth: false });
}


export function updateMyTeacherLocation(payload: TeacherLocationPayload) {
  return apiRequest<void>(`/teachers/me/location`, {
    method: "PUT",
    body: payload,
    auth: true,
  });
}