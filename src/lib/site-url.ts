/** Canonical origin, without a trailing slash. Server and build use only. */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}
