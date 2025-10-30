import { API_URL } from './env'

export function normalizeDomain(host?: string | null) {
  const raw = (host || "").trim().toLowerCase();
  return raw.split(":")[0].replace(/^www\./, "");
}

export const getMenuImageUrl = (backImage: any) => !!backImage && typeof (backImage) === 'string' && backImage.startsWith("id:") ? API_URL + "/menu/images/" + backImage.replace("id:", "") :
  typeof (backImage) === 'number' ? API_URL + "/menu/images/" + backImage : backImage

export const priceFor = (x: any, orderType: "pickup" | "delivery") => {
  const raw = orderType === "delivery" ? x?.Delivery_Price : x?.Collection_Price;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

export const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// helpers (place above the component or in a utils file)
const sortKeys = v =>
  Array.isArray(v)
    ? v.map(sortKeys).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
    : v && typeof v === "object"
    ? Object.keys(v).sort().reduce((o, k) => ((o[k] = sortKeys(v[k])), o), {})
    : v;

const stableStringify = v => JSON.stringify(sortKeys(v));
const linkKey = v => stableStringify(Array.isArray(v) ? v : []);
export const itemKey = x =>
  `${x.id}__L:${linkKey(x.basketLinkedMenuData)}__T:${linkKey(x.basketTopLevelLinkedMenuData)}`;
export const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;


