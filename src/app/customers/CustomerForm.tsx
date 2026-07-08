import { RequestType } from "@/generated/prisma/client";
import { REQUEST_TYPE_OPTIONS } from "./request-type";

type CustomerFormValues = {
  name: string;
  kana: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  memo: string | null;
  startDate: Date | null;
  endDate: Date | null;
  requestType: RequestType | null;
};

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default function CustomerForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: CustomerFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700">
          氏名/会社名 <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="kana" className="text-sm font-medium text-zinc-700">
          フリガナ
        </label>
        <input
          id="kana"
          name="kana"
          defaultValue={defaultValues?.kana ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="company" className="text-sm font-medium text-zinc-700">
          会社名
        </label>
        <input
          id="company"
          name="company"
          defaultValue={defaultValues?.company ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
          電話番号
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={defaultValues?.phone ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium text-zinc-700">
          住所
        </label>
        <input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
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
          defaultValue={defaultValues?.requestType ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        >
          <option value="">未選択</option>
          {REQUEST_TYPE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-zinc-700"
          >
            開始日
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={toDateInputValue(defaultValues?.startDate)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-zinc-700"
          >
            終了日
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={toDateInputValue(defaultValues?.endDate)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="memo" className="text-sm font-medium text-zinc-700">
          メモ
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={4}
          defaultValue={defaultValues?.memo ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
