import "server-only";
import { unstable_cache } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { headers } from "next/headers";

function normalizeDomain(host?: string | null) {
  const raw = (host || "").trim().toLowerCase();
  return raw.split(":")[0].replace(/^www\./, "");
}

async function fetchMainData(domain: string) {
  const { data } = await apiClient.get("/public/main-data", { params: { domain } });
  return data.result;
}

const getRestaurantCached = unstable_cache(
  (domain: string) => fetchMainData(domain),
  ["restaurant-by-domain"],
  { revalidate: 300, tags: ["restaurant"] }
);

export async function getRestaurantForRequest() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const domain = normalizeDomain(host);
  if (!domain) throw new Error("Host header missing");
  return getRestaurantCached(domain); // returns a Promise, ok to return directly
}
