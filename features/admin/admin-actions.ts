"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createSessionToken,
  isAdminConfigured,
  passwordMatches,
} from "@/lib/admin-session";

export interface LoginState {
  message: string;
}

const FAILED_LOGIN_DELAY_MS = 800;

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { message: "Admin login is not configured on this server." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    // A fixed delay slows down guessing without needing any shared state.
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return { message: "Incorrect password." };
  }

  const token = createSessionToken();
  if (!token) return { message: "Admin login is not configured on this server." };

  (await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
