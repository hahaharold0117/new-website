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