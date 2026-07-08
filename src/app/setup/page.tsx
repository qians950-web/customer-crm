import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-12">
      <div>
        <h1 className="text-xl font-semibold">初期セットアップ</h1>
        <p className="mt-1 text-sm text-zinc-500">
          最初の管理者アカウントを作成します。この画面は一度だけ使用できます。
        </p>
      </div>
      <SetupForm />
    </div>
  );
}
