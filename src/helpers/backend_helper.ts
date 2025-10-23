import { post, get, put, del } from "./api_helper";
import * as url from "./url_helper";

const getMainSettingData = (domain: string) => get(`${url.GET_MAIN_SETTING}?domain=${encodeURIComponent(domain)}`);
const customerLoginAsync = (data: any) => post(url.CUSTOMER_LOGIN, data)
const customerSignupAsync = (data: any) => post(url.CUSTOMER_SIGNUP, data)
const createOrder = (orderItem: any) => post(url.CREATE_ORDER, orderItem);
const createOrderDetailBatch = (detailBatchData: any) => post(url.BATCH_CREATE_ORDER, detailBatchData)

export {
  getMainSettingData,
  customerLoginAsync,
  customerSignupAsync,
  createOrder,
  createOrderDetailBatch
}