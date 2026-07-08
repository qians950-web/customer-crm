"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createFirstAdmin(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password) {
    return { error: "すべて入力してください" };
  }
  if (password.length < 8) {
    return { error: "パスワードは8文字以上にしてください" };
  }
  if (password !== confirmPassword) {
    return { error: "パスワードが一致しません" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.user.count();
      if (existing > 0) {
        throw new Error("ALREADY_SETUP");
      }
      await tx.user.create({ data: { name, email, passwordHash } });
    });
  } catch {
    return { error: "セットアップは既に完了しています。ログインしてください。" };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/customers" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "アカウントは作成されました。ログインしてください。" };
    }
    throw error;
  }
}
