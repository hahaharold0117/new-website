import { post, get, put, del } from "./api_helper";
import * as url from "./url_helper";

const getMainSettingData = (domain: string) => get(`${url.GET_MAIN_SETTING}?domain=${encodeURIComponent(domain)}`);

export {
  getMainSettingData,
}