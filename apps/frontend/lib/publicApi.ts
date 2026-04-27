/**
 * Public API origin for browser fetches.
 * - Empty: same-origin paths like `/api/...` (proxied by Next rewrites to the backend).
 * - Set NEXT_PUBLIC_API_URL when the API is on another host.
 */
export function publicApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw || raw === "same-origin") return "";
  return raw.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = publicApiOrigin();
  return origin ? `${origin}${p}` : p;
}
