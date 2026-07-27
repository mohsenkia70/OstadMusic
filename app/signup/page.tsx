"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  GraduationCap,
  Music2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/lib/store/auth-store";


type SignupForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};



export default function SignupPage() {


  const router = useRouter();


  const [role, setRole] =
    useState<"student" | "teacher">("student");



  const registerStudent =
    useAuthStore((state) => state.registerStudent);


  const registerTeacher =
    useAuthStore((state) => state.registerTeacher);


  const isLoading =
    useAuthStore((state) => state.isLoading);


  const error =
    useAuthStore((state) => state.error);


  const clearError =
    useAuthStore((state) => state.clearError);





  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();





  function splitName(fullName: string) {

    const parts =
      fullName.trim().split(" ");


    return {

      firstName: parts[0] || "",

      lastName:
        parts.slice(1).join(" ") || "-",

    };

  }







  const onSubmit = async (
    data: SignupForm
  ) => {


    try {


      clearError();


      const {
        firstName,
        lastName,
      } = splitName(data.fullName);




      let user;





      if (role === "student") {


        user =
          await registerStudent({

            firstName,

            lastName,

            email: data.email,

            phoneNumber: data.phoneNumber,

            password: data.password,


            city: "تهران",

            district: "تهران",

            learningGoal: "یادگیری موسیقی",

          });



      } else {



        user =
          await registerTeacher({

            firstName,

            lastName,

            email: data.email,

            phoneNumber: data.phoneNumber,

            password: data.password,


            city: "",

            district: "",


            bio: "",


            yearsOfExperience: 0,


            hourlyRate: 0,


            musicCategoryIds: [],

          });


      }






      if (user.role === "Teacher") {

        router.push("/dashboard/teacher");

      } else {

        router.push("/dashboard/student");

      }




    } catch {

      // Error is already handled inside Zustand store

    }

  };







  return (


    <AuthShell

      title="ساخت حساب کاربری"

      subtitle="در کمتر از یک دقیقه به جمع استاد موزیک بپیوند."

      footer={

        <>

          قبلا ثبت‌نام کردی؟{" "}


          <Link

            href="/login"

            className="text-gold font-semibold hover:underline"

          >

            وارد شو

          </Link>


        </>

      }


    >




      <div className="grid grid-cols-2 gap-3 mb-7">



        <button

          type="button"

          onClick={() => {

            clearError();

            setRole("student");

          }}

          className={cn(

            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",

            role === "student"

              ? "border-gold/50 bg-gold-soft text-gold"

              : "border-line text-muted"

          )}

        >

          <GraduationCap className="h-5 w-5" />

          شاگرد هستم


        </button>






        <button

          type="button"

          onClick={() => {

            clearError();

            setRole("teacher");

          }}

          className={cn(

            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",

            role === "teacher"

              ? "border-gold/50 bg-gold-soft text-gold"

              : "border-line text-muted"

          )}

        >

          <Music2 className="h-5 w-5" />

          استاد هستم


        </button>



      </div>









      <form

        onSubmit={handleSubmit(onSubmit)}

        className="space-y-5"

        noValidate

      >




        {error && (

          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">

            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />

            <span>

              {error}

            </span>

          </div>

        )}









        <div>


          <Label htmlFor="fullName">

            نام و نام خانوادگی

          </Label>



          <Input

            id="fullName"

            placeholder="مثلا محسن کیا"

            onFocus={clearError}

            {...register(

              "fullName",

              {

                required: true,

              }

            )}

          />



          {errors.fullName && (

            <p className="text-xs text-red-600 mt-1.5">

              این فیلد الزامی است

            </p>

          )}


        </div>









        <div>


          <Label htmlFor="email">

            ایمیل

          </Label>



          <Input

            id="email"

            placeholder="example@gmail.com"

            onFocus={clearError}

            {...register(

              "email",

              {

                required: true,

              }

            )}

          />



          {errors.email && (

            <p className="text-xs text-red-600 mt-1.5">

              ایمیل الزامی است

            </p>

          )}


        </div>









        <div>


          <Label htmlFor="phoneNumber">

            شماره تماس

          </Label>



          <Input

            id="phoneNumber"

            placeholder="09123456789"

            onFocus={clearError}

            {...register(

              "phoneNumber",

              {

                required: true,

              }

            )}

          />



          {errors.phoneNumber && (

            <p className="text-xs text-red-600 mt-1.5">

              شماره تماس الزامی است

            </p>

          )}


        </div>









        <div>


          <Label htmlFor="password">

            رمز عبور

          </Label>



          <Input

            id="password"

            type="password"

            placeholder="حداقل ۸ کاراکتر"

            onFocus={clearError}

            {...register(

              "password",

              {

                required: true,

                minLength: 8,

              }

            )}

          />



          {errors.password && (

            <p className="text-xs text-red-600 mt-1.5">

              رمز عبور باید حداقل ۸ کاراکتر باشد

            </p>

          )}


        </div>








        <Button

          type="submit"

          size="lg"

          className="w-full gap-2"

          disabled={isLoading}

        >



          {isLoading && (

            <Loader2 className="h-4 w-4 animate-spin" />

          )}



          {role === "student"

            ? "ساخت حساب شاگرد"

            : "ساخت حساب استاد"

          }



        </Button>






        <p className="text-xs text-muted text-center leading-6">

          با ثبت‌نام، شرایط استفاده و حریم خصوصی استاد موزیک را می‌پذیری.

        </p>




      </form>





    </AuthShell>


  );


}