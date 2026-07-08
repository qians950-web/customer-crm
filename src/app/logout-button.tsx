import { logout } from "./logout-action";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline"
      >
        ログアウト
      </button>
    </form>
  );
}
