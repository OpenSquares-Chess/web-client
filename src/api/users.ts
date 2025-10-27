import type { CreateUserRequest, UserResponse } from "../types/user";
const API_BASE = (import.meta.env.VITE_API_BASE || "").trim();
const DEV_MODE =
  (import.meta.env.VITE_PROFILE_DEV_MODE || "").toLowerCase() === "true";

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function apiMissing() {
  return !API_BASE;
}

/** 200 => user exists, 404 => new, others => error */
export async function getSelfUser(token: string): Promise<UserResponse | null> {
  if (apiMissing()) {
    
    return DEV_MODE ? null : null;
  }
  const res = await fetch(`${API_BASE}/users/self`, { headers: authHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /users/self failed (${res.status})`);
  return res.json();
}

export async function createUser(
  token: string,
  body: CreateUserRequest
): Promise<UserResponse> {
  if (apiMissing()) throw new Error("Profile API base URL not configured");
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /users failed (${res.status})`);
  return res.json();
}
