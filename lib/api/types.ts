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