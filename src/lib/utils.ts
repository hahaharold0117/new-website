import {API_URL} from './env'

export function normalizeDomain(host?: string | null) {
  const raw = (host || "").trim().toLowerCase();
  return raw.split(":")[0].replace(/^www\./, "");
}

export const getMenuImageUrl = (backImage: any) => !!backImage && typeof (backImage) === 'string' && backImage.startsWith("id:") ? API_URL + "/menu/images/" + backImage.replace("id:", "") :
  typeof (backImage) === 'number' ? API_URL + "/menu/images/" + backImage : backImage

