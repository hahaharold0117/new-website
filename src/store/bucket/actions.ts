import { BucketActionTypes } from "./actionTypes";
import { LS_KEY } from '@/lib/env';
//get all dmin by sitecode
export const addBucketItem = (data) => ({
  type: BucketActionTypes.ADD_BUCKET_ITEM,
  payload: data
});

export const removeBucketItem = (index: number) => ({
  type: BucketActionTypes.REMOVE_BUCKET_ITEM,
  payload: index,
});

export const clearBucketItems = () => ({
  type: BucketActionTypes.CLEAR_BUCKET,
});

export const updateBucketItem = (index, item) => ({
  type: BucketActionTypes.UPDATE_BUCKET_ITEM,
  payload: { index, item },
});

export const updateBucketItemByIndex = (payload) => ({
  type: BucketActionTypes.UPDATE_BUCKET_ITEM_INDEX,
  payload,
});

export const setDeliveryChargeAmount = (amount) => ({
  type: BucketActionTypes.SET_DELIVERY_CHARGE_AMOUNT,
  payload: amount,
});

export const setTipAmount = (tip) => ({
  type: BucketActionTypes.SET_TIP_AMOUNT,
  payload: tip,
});

export const resetBucket = () => {
  try { if (typeof window !== "undefined") localStorage.removeItem(LS_KEY); } catch {}
  return { type: BucketActionTypes.RESET_BUCKET };
};