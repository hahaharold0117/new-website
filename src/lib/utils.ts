export function normalizeDomain(host?: string | null) {
  const raw = (host || "").trim().toLowerCase();
  return raw.split(":")[0].replace(/^www\./, "");
}
