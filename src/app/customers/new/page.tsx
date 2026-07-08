import Link from "next/link";
import CustomerForm from "../CustomerForm";
import { createCustomer } from "../actions";
import { requireUser } from "@/lib/dal";

export default async function NewCustomerPage() {
  await requireUser();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">顧客の新規登録</h1>
      <CustomerForm action={createCustomer} submitLabel="登録する" />
      <Link href="/customers" className="text-sm text-zinc-500 hover:underline">
        ← 一覧に戻る
      </Link>
    </div>
  );
}
