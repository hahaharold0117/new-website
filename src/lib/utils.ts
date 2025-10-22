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

