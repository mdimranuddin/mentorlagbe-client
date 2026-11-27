import { authClient } from "./auth-client";

const API = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number; code?: string;
  constructor(message: string, status: number, code?: string) { super(message); this.status = status; this.code = code; }
}

// Browser side: attaches the Better Auth JWT, the Express server verifies it.
export async function apiFetch<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) {
    const { data } = await authClient.token();
    if (data?.token) headers.Authorization = `Bearer ${data.token}`;
  }
  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? "GET", headers, cache: "no-store",
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.message ?? "Something went wrong", res.status, json.code);
  return json as T;
}
