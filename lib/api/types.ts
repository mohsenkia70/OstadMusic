export type Role = "Teacher" | "Student" | string;


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

export type ApiErrorBody = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};


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


export type CreateBookingRequest = {
  teacherProfileId: string;
  musicCategoryId?: number | null;
  sessionStartUtc: string; // ISO
  durationMinutes: number;
  studentNote?: string | null;
};

export type BookingActionRequest = {
  note?: string | null;
};

export type CreatePaymentRequest = {
  bookingId: string;
};

/** پاسخ ساخت رزرو — بک‌اند ممکنه فقط id برگردونه یا آبجکت کامل */
export type CreateBookingResponse = {
  id?: string;
  bookingId?: string;
  [key: string]: unknown;
};

export type PaymentRequestResponse = {
  paymentUrl?: string;
  authority?: string;
  url?: string;
  [key: string]: unknown;
};

export type MusicCategory = {
  id: number;
  name: string;
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

export class ApiError extends Error {

  status:number;

  body:unknown;


  constructor(
    message:string,
    status:number,
    body?:unknown
  ){

    super(message);

    this.name="ApiError";

    this.status=status;

    this.body=body;

  }

}