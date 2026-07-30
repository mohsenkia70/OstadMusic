// Base URL for your friend's backend API. Override per-environment with
// NEXT_PUBLIC_API_URL (e.g. in .env.local) — see README for details.
//
// NOTE: the default below points at an http:// IP address. That's fine for
// local development, but if you deploy this Next.js app over HTTPS, browsers
// will block "mixed content" requests from an HTTPS page to a plain HTTP
// API. Once your friend's API has a real domain + TLS certificate, update
// this (or the env var) to an https:// URL.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://185.19.201.55:3000/api/v1";
