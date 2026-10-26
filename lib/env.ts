/**
 * Public (browser-safe) environment, validated once at module load.
 * `process.env.NEXT_PUBLIC_*` must be referenced literally so Next.js can inline it at build time.
 */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (see .env.example).")
}

export const env = {
  /** API origin without a trailing slash, e.g. https://api.example.com */
  apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
  /** Shared key the public-site endpoints (`/v2/...`) expect in the Authorization header */
  siteApiKey: process.env.NEXT_PUBLIC_TOKEN_KEY ?? "",
} as const
