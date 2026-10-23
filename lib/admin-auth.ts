import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./admin-session";

export async function isAdmin(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(ADMIN_COOKIE_NAME)?.value);
}

/**
 * Call at the top of every admin page and server action, close to the data.
 * The proxy is only a first line of defence: server actions can be invoked without going through a page.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
