import { BucketActionTypes } from "./actionTypes";

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


