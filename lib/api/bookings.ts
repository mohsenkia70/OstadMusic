import { apiRequest } from "./client";
import type {
  BookingActionRequest,
  BookingItem,
  CreateBookingRequest,
  CreateBookingResponse,
  CreatePaymentRequest,
  MusicCategory,
  PaymentRequestResponse,
} from "./types";

export function createBooking(data: CreateBookingRequest) {
  return apiRequest<CreateBookingResponse>("/bookings", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export function getMyBookings() {
  return apiRequest<BookingItem[]>("/bookings/mine", { auth: true });
}

export function getBookingById(id: string) {
  return apiRequest<BookingItem>(`/bookings/${id}`, { auth: true });
}

export function approveBooking(id: string, note?: string) {
  return apiRequest<unknown>(`/bookings/${id}/approve`, {
    method: "POST",
    body: { note } satisfies BookingActionRequest,
    auth: true,
  });
}

export function rejectBooking(id: string, note?: string) {
  return apiRequest<unknown>(`/bookings/${id}/reject`, {
    method: "POST",
    body: { note } satisfies BookingActionRequest,
    auth: true,
  });
}

export function cancelBooking(id: string, note?: string) {
  return apiRequest<unknown>(`/bookings/${id}/cancel`, {
    method: "POST",
    body: { note } satisfies BookingActionRequest,
    auth: true,
  });
}

export function requestZarinpalPayment(data: CreatePaymentRequest) {
  return apiRequest<PaymentRequestResponse>("/payments/zarinpal/request", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export function getMusicCategories() {
  return apiRequest<MusicCategory[]>("/music-categories", { auth: false });
}

/** استخراج bookingId از پاسخ ساخت رزرو */
export function extractBookingId(res: CreateBookingResponse): string | null {
  if (typeof res === "string") return res;
  if (res?.id && typeof res.id === "string") return res.id;
  if (res?.bookingId && typeof res.bookingId === "string") return res.bookingId;
  return null;
}

/** استخراج لینک پرداخت */
export function extractPaymentUrl(res: PaymentRequestResponse): string | null {
  if (res?.paymentUrl && typeof res.paymentUrl === "string") return res.paymentUrl;
  if (res?.url && typeof res.url === "string") return res.url;
  if (res?.authority && typeof res.authority === "string") {
    return `https://www.zarinpal.com/pg/StartPay/${res.authority}`;
  }
  return null;
}