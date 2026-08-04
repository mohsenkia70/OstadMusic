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