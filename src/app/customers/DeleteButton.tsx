"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("この顧客を削除します。よろしいですか？")) {
          e.preventDefault();
        }
      }}
      className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      削除
    </button>
  );
}
