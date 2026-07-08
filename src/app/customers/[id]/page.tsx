import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteCustomer } from "../actions";
import DeleteButton from "../DeleteButton";
import { requireUser } from "@/lib/dal";
import { REQUEST_TYPE_LABELS } from "../request-type";

function formatDate(date: Date | null) {
  return date ? date.toLocaleDateString("ja-JP") : null;
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    notFound();
  }

  const fields: { label: string; value: string | null }[] = [
    { label: "フリガナ", value: customer.kana },
    { label: "会社名", value: customer.company },
    { label: "メールアドレス", value: customer.email },
    { label: "電話番号", value: customer.phone },
    { label: "住所", value: customer.address },
    {
      label: "依頼内容",
      value: customer.requestType
        ? REQUEST_TYPE_LABELS[customer.requestType]
        : null,
    },
    { label: "開始日", value: formatDate(customer.startDate) },
    { label: "終了日", value: formatDate(customer.endDate) },
    { label: "メモ", value: customer.memo },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">{customer.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/customers/${customer.id}/edit`}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            編集
          </Link>
          <form action={deleteCustomer.bind(null, customer.id)}>
            <DeleteButton />
          </form>
        </div>
      </div>

      <dl className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
        {fields.map((field) => (
          <div key={field.label} className="grid grid-cols-3 gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-zinc-500">
              {field.label}
            </dt>
            <dd className="col-span-2 text-sm text-zinc-900">
              {field.value ?? "-"}
            </dd>
          </div>
        ))}
      </dl>

      <Link href="/customers" className="text-sm text-zinc-500 hover:underline">
        ← 一覧に戻る
      </Link>
    </div>
  );
}
