"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./admin-actions";

const initialState: LoginState = { message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={200}
          aria-invalid={state.message ? true : undefined}
          aria-describedby={state.message ? "admin-password-error" : undefined}
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400"
        />
        <p id="admin-password-error" role="alert" className="mt-1 min-h-5 text-sm text-red-700 dark:text-red-300">
          {state.message}
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
