// ─── Auth ────────────────────────────────────────────────────────────────────

export type Role = "Teacher" | "Student" | "Admin" | string;

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export type RegisterStudentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  city: string;
  district: string;
  learningGoal: string;
};

export type RegisterTeacherRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  city: string;
  district: string;
  bio: string;
  yearsOfExperience: number;
  hourlyRate: number;
  musicCategoryIds: number[];
};

export type AuthResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  role: Role;
  accessToken: string;
  expiresAtUtc: string;
};

// ─── API Error ───────────────────────────────────────────────────────────────

export type ApiErrorBody = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ─── Teacher ─────────────────────────────────────────────────────────────────

export type TeacherListItem = {
  teacherProfileId: string;
  userId: string;
  fullName: string;
  city: string;
  district: string | null;
  yearsOfExperience: number;
  hourlyRate: number;
  ratingAverage: number;
  ratingCount: number;
  isVerified: boolean;
  bioShort: string;
  categories: string[];
  // فیلدهای جدید برای پروفایل کامل
  profileImage?: string | null;      // آدرس عکس پروفایل
  resume?: string | null;           // متن رزومه کامل
  teachingStyle?: string | null;    // سبک تدریس
  education?: string | null;        // تحصیلات
  achievements?: string | null;     // دستاوردها
  // فیلدهای موقعیت
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
};

export type TeacherDetail = TeacherListItem & {
  bio: string;
  phoneNumber?: string;
  email?: string;
};

export type TeachersListResponse = {
  items: TeacherListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

// ─── Location ────────────────────────────────────────────────────────────────

export type TeacherLocationPayload = {
  latitude: number;
  longitude: number;
};

export type TeacherLocation = {
  latitude: number;
  longitude: number;
  address?: string | null;
};

// ─── Booking ─────────────────────────────────────────────────────────────────

export type CreateBookingRequest = {
  teacherProfileId: string;
  musicCategoryId?: number | null;
  sessionStartUtc: string;
  durationMinutes: number;
  studentNote?: string | null;
};

export type BookingActionRequest = {
  note?: string | null;
};

export type CreateBookingResponse = {
  id?: string;
  bookingId?: string;
  [key: string]: unknown;
};

export type BookingItem = {
  id: string;
  teacherProfileId?: string;
  teacherFullName?: string;
  studentProfileId?: string;
  studentFullName?: string;
  sessionStartUtc?: string;
  durationMinutes?: number;
  status?: string;
  studentNote?: string | null;
  teacherResponseNote?: string | null;
  musicCategoryId?: number;
  musicCategoryName?: string;
  priceAmount?: number;
  latestPaymentStatus?: string | null;
  createdAtUtc?: string;
  [key: string]: unknown;
};

// ─── Payment ─────────────────────────────────────────────────────────────────

export type CreatePaymentRequest = {
  bookingId: string;
};

export type PaymentRequestResponse = {
  paymentUrl?: string;
  authority?: string;
  url?: string;
  [key: string]: unknown;
};

// ─── Music ───────────────────────────────────────────────────────────────────

export type MusicCategory = {
  id: number;
  name: string;
};

// ─── Teacher Onboarding ──────────────────────────────────────────────────────

export type TeacherOnboardingStatus = {
  hasResume?: boolean;
  resumeFileName?: string | null;
  resumeUploadedAtUtc?: string | null;
  approvalStatus?: ApprovalStatus | null;
  rejectionReason?: string | null;
  [key: string]: unknown;
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export type ApprovalStatus =
  | "PendingReview"
  | "Approved"
  | "Rejected"
  | string;

export type AdminTeacher = {
  teacherProfileId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  district: string | null;
  yearsOfExperience: number;
  hourlyRate: number;
  approvalStatus: ApprovalStatus;
  registeredAtUtc: string;
  bio: string;
  categories: string[];
  rejectionReason: string | null;
  reviewedAtUtc: string | null;
};

export type AdminTeachersListResponse = {
  items: AdminTeacher[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};