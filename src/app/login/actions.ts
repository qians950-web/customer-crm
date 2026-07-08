"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/customers",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "メールアドレスまたはパスワードが違います" };
    }
    throw error;
  }
}
