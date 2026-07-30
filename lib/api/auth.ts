import { apiRequest } from "./client";

import type {
  AuthResponse,
  LoginRequest,
  RegisterStudentRequest,
  RegisterTeacherRequest
} from "./types";



export function loginRequest(
  credentials:LoginRequest
){

return apiRequest<AuthResponse>(
"/auth/login",
{
method:"POST",
body:credentials,
auth:false
}
);

}


export function registerStudentRequest(
data:RegisterStudentRequest
){

return apiRequest<AuthResponse>(
"/auth/register/student",
{
method:"POST",
body:data,
auth:false
}
);

}

export function registerTeacherRequest(
data:RegisterTeacherRequest
){

return apiRequest<AuthResponse>(
"/auth/register/teacher",
{
method:"POST",
body:data,
auth:false
}
);

}