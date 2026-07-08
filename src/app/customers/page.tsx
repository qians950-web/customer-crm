import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import { Prisma, RequestType } from "@/generated/prisma/client";
import { REQUEST_TYPE_LABELS, REQUEST_TYPE_OPTIONS } from "./request-type";

function formatDate(date: Date | null) {
  return date ? date.toLocaleDateString("ja-JP") : "-";
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    startFrom?: string;
    startTo?: string;
    requestType?: string;
  }>;
}) {
  await requireUser();
  const { q, startFrom, startTo, requestType } = await searchParams;
  const keyword = q?.trim() ?? "";

  const isRequestType = (
    value: string | undefined,
  ): value is RequestType =>
    !!value && (Object.values(RequestType) as string[]).includes(value);

  const conditions: Prisma.CustomerWhereInput[] = [];

  if (keyword) {
    conditions.push({
      OR: [
        { name: { contains: keyword } },
        { kana: { contains: keyword } },
        { company: { contains: keyword } },
        { email: { contains: keyword } },
        { phone: { contains: keyword } },
      ],
    });
  }

  if (startFrom) {
    conditions.push({ startDate: { gte: new Date(startFrom) } });
  }

  if (startTo) {
    const endOfDay = new Date(startTo);
    endOfDay.setHours(23, 59, 59, 999);
    conditions.push({ startDate: { lte: endOfDay } });
  }

  if (isRequestType(requestType)) {
    conditions.push({ requestType });
  }

  const customers = await prisma.customer.findMany({
    where: conditions.length ? { AND: conditions } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const hasFilter = !!(keyword || startFrom || startTo || requestType);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">顧客一覧</h1>
        <Link
          href="/customers/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + 新規登録
        </Link>
      </div>

      <form className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-sm font-medium text-zinc-700">
            キーワード検索
          </label>
          <input
            id="q"
            type="text"
            name="q"
            defaultValue={keyword}
            placeholder="氏名・会社名・メール・電話番号で検索"
            className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="startFrom"
              className="text-sm font-medium text-zinc-700"
            >
              開始日(from)
            </label>
            <input
              id="startFrom"
              type="date"
              name="startFrom"
              defaultValue={startFrom ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="startTo"
              className="text-sm font-medium text-zinc-700"
            >
              開始日(to)
            </label>
            <input
              id="startTo"
              type="date"
              name="startTo"
              defaultValue={startTo ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="requestType"
              className="text-sm font-medium text-zinc-700"
            >
              依頼内容
            </label>
            <select
              id="requestType"
              name="requestType"
              defaultValue={requestType ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            >
              <option value="">すべて</option>
              {REQUEST_TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="whitespace-nowrap rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              検索
            </button>
            {hasFilter && (
              <Link
                href="/customers"
                className="whitespace-nowrap rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
              >
                クリア
              </Link>
            )}
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium">氏名/会社名</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">会社名</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">電話番号</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">メールアドレス</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">開始日</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">終了日</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">依頼内容</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {customer.company ?? "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {customer.phone ?? "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {customer.email ?? "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {formatDate(customer.startDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {formatDate(customer.endDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                  {customer.requestType
                    ? REQUEST_TYPE_LABELS[customer.requestType]
                    : "-"}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  {hasFilter
                    ? "条件に一致する顧客が見つかりませんでした"
                    : "登録されている顧客がいません"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
