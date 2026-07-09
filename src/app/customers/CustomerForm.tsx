"use client";

import { useRef, useState } from "react";
import { RequestType } from "@/generated/prisma/client";
import { REQUEST_TYPE_OPTIONS } from "./request-type";

type CustomerFormValues = {
  name: string;
  kana: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  postalCode: string | null;
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

function hiraganaToKatakana(value: string) {
  return value.replace(/[ぁ-ゖ]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0x60),
  );
}

function isHiraganaOnly(value: string) {
  return /^[ぁ-ゖー]+$/.test(value);
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
  const [kana, setKana] = useState(defaultValues?.kana ?? "");
  const [address, setAddress] = useState(defaultValues?.address ?? "");
  const kanaTouchedRef = useRef(false);
  const readingBufferRef = useRef("");

  const handleNameCompositionUpdate = (
    event: React.CompositionEvent<HTMLInputElement>,
  ) => {
    if (isHiraganaOnly(event.data)) {
      readingBufferRef.current = event.data;
    }
  };

  const handleNameCompositionEnd = () => {
    if (!kanaTouchedRef.current && readingBufferRef.current) {
      setKana((prev) => prev + hiraganaToKatakana(readingBufferRef.current));
    }
    readingBufferRef.current = "";
  };

  const handlePostalCodeBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const digits = event.target.value.replace(/[^0-9]/g, "");
    if (digits.length !== 7 || address.trim() !== "") {
      return;
    }
    try {
      const res = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`,
      );
      const data = await res.json();
      const result = data?.results?.[0];
      if (result) {
        setAddress(
          `${result.address1}${result.address2}${result.address3}`,
        );
      }
    } catch {
      // 住所の自動入力に失敗しても手入力できるので無視する
    }
  };

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
          onCompositionUpdate={handleNameCompositionUpdate}
          onCompositionEnd={handleNameCompositionEnd}
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
          value={kana}
          onChange={(event) => {
            kanaTouchedRef.current = true;
            setKana(event.target.value);
          }}
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
        <label
          htmlFor="postalCode"
          className="text-sm font-medium text-zinc-700"
        >
          郵便番号
        </label>
        <input
          id="postalCode"
          name="postalCode"
          placeholder="1500001"
          defaultValue={defaultValues?.postalCode ?? ""}
          onBlur={handlePostalCodeBlur}
          className="max-w-[10rem] rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium text-zinc-700">
          住所
        </label>
        <input
          id="address"
          name="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
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
