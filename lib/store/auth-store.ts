import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  loginRequest,
  registerStudentRequest,
  registerTeacherRequest,
} from "@/lib/api/auth";

import { ApiError } from "@/lib/api/types";

import type {
  Role,
  RegisterStudentRequest,
  RegisterTeacherRequest,
} from "@/lib/api/types";

export type AuthUser = {
  userId: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type AuthState = {
  user: AuthUser | null;

  accessToken: string | null;

  expiresAtUtc: string | null;

  isLoading: boolean;

  error: string | null;

  hasHydrated: boolean;

  login: (emailOrPhone: string, password: string) => Promise<AuthUser>;

  registerStudent: (data: RegisterStudentRequest) => Promise<AuthUser>;

  registerTeacher: (data: RegisterTeacherRequest) => Promise<AuthUser>;

  logout: () => void;

  clearError: () => void;

  isTokenExpired: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      accessToken: null,

      expiresAtUtc: null,

      isLoading: false,

      error: null,

      hasHydrated: false,

      login: async (emailOrPhone, password) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await loginRequest({
            emailOrPhone,
            password,
          });

          const user: AuthUser = {
            userId: res.userId,

            firstName: res.firstName,

            lastName: res.lastName,

            role: res.role,
          };

          set({
            user,

            accessToken: res.accessToken,

            expiresAtUtc: res.expiresAtUtc,

            isLoading: false,

            error: null,
          });

          return user;
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.message
              : "ورود ناموفق بود. دوباره تلاش کن.";

          set({
            isLoading: false,

            error: message,

            user: null,

            accessToken: null,

            expiresAtUtc: null,
          });

          throw err;
        }
      },

      registerStudent: async (data) => {
        set({
          isLoading: true,

          error: null,
        });

        try {
          const res = await registerStudentRequest(data);

          const user: AuthUser = {
            userId: res.userId,

            firstName: res.firstName,

            lastName: res.lastName,

            role: res.role,
          };

          set({
            user,

            accessToken: res.accessToken,

            expiresAtUtc: res.expiresAtUtc,

            isLoading: false,

            error: null,
          });

          return user;
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : "ثبت‌نام شاگرد ناموفق بود.";

          set({
            isLoading: false,

            error: message,
          });

          throw err;
        }
      },

      registerTeacher: async (data) => {
        set({
          isLoading: true,

          error: null,
        });

        try {
          const res = await registerTeacherRequest(data);

          const user: AuthUser = {
            userId: res.userId,

            firstName: res.firstName,

            lastName: res.lastName,

            role: res.role,
          };

          set({
            user,

            accessToken: res.accessToken,

            expiresAtUtc: res.expiresAtUtc,

            isLoading: false,

            error: null,
          });

          return user;
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : "ثبت‌نام استاد ناموفق بود.";

          set({
            isLoading: false,

            error: message,
          });

          throw err;
        }
      },

      logout: () => {
        set({
          user: null,

          accessToken: null,

          expiresAtUtc: null,

          error: null,
        });
      },

      clearError: () => {
        set({
          error: null,
        });
      },

      isTokenExpired: () => {
        const { expiresAtUtc } = get();

        if (!expiresAtUtc) return true;

        return new Date(expiresAtUtc).getTime() <= Date.now();
      },
    }),

    {
      name: "ostad-music-auth",

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },

      partialize: (state) => ({
        user: state.user,

        accessToken: state.accessToken,

        expiresAtUtc: state.expiresAtUtc,
      }),
    },
  ),
);
