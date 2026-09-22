import type { Config, Context } from "@netlify/edge-functions";

export default async function hajiloopCountryLocale(
  request: Request,
  context: Context,
) {
  const response = await context.next();

  if (request.method !== "GET") return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const country = context.geo?.country?.code?.toUpperCase() ?? "";
  const locale = country === "TH" ? "th" : country === "ID" ? "id" : "en";

  const source = await response.text();
  const localized = source.replace(
    '<html lang="en" data-geo-locale="en">',
    `<html lang="${locale}" data-geo-locale="${locale}">`,
  );

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("X-Hajiloop-Locale", locale);

  return new Response(localized, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config: Config = {
  path: "/",
};
