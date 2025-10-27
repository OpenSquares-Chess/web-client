import { useState } from "react";
import type { CreateUserRequest } from "../../../types/user";

type Props = {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  busy?: boolean;
  error?: string | null;
};

const USER_RE = /^[A-Za-z0-9_]{3,24}$/;

export default function Signup({ onSubmit, busy, error }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setLocalError("All fields are required.");
      return;
    }

    if (!USER_RE.test(username)) {
      setLocalError("Use 3–24 characters: letters, numbers, or underscore.");
      return;
    }

    setLocalError(null);
    const body: CreateUserRequest = { username: username.trim() };
    await onSubmit(body);
  }

  return (
    <div className="relative w-full flex flex-col items-center min-h-screen bg-[#1c1c24] text-[#cccccc]">
      {/* App name */}
      <div className="mb-12 text-center text-[65px] font-extrabold leading-none tracking-tight">
        <span className="text-[#eedc97]">OpenSquares</span>
        <span className="text-[#964d22]">Chess</span>
      </div>

      {/* Avatar fixed in top-right */}
      {username.trim() !== "" && (
        <div className="absolute top-8 right-8">
          <div className="h-16 w-16 rounded-full bg-[#964d22] border-4 border-[#eedc97] grid place-items-center text-white text-2xl font-semibold shadow-lg">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="w-full max-w-md rounded-3xl bg-[#1f1f28] border border-[#2c2c34] p-8 shadow-[0_10px_40px_rgba(0,0,0,.5)] text-[#cccccc]">
        <h1 className="text-2xl font-semibold text-center mb-8 text-[#eedc97] uppercase">
          Create Your Profile
        </h1>

        <form onSubmit={submit} className="space-y-6">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md bg-[#0f0f14] border border-[#3a2a1b] px-3 py-3 text-[#e5e7eb] placeholder-[#7c7c7c] focus:border-[#eedc97] focus:ring-2 focus:ring-[#eedc97]/60 outline-none text-lg"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-md bg-[#0f0f14] border border-[#3a2a1b] px-3 py-3 text-[#e5e7eb] placeholder-[#7c7c7c] focus:border-[#eedc97] focus:ring-2 focus:ring-[#eedc97]/60 outline-none text-lg"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={24}
            className="w-full rounded-md bg-[#0f0f14] border border-[#3a2a1b] px-3 py-3 text-[#e5e7eb] placeholder-[#7c7c7c] focus:border-[#eedc97] focus:ring-2 focus:ring-[#eedc97]/60 outline-none text-lg"
          />

          {(localError || error) && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-200">
              {localError || error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-[#964d22] hover:bg-[#7f3f1c] px-4 py-3 text-lg text-white font-semibold shadow-md shadow-black/30 focus:outline-none focus:ring-4 focus:ring-[#eedc97]/30 disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
