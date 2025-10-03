import { BucketActionTypes } from "./actionTypes";

//get all dmin by sitecode
export const getRestaurantGiftCards = (id: string) => ({
  type: BucketActionTypes.GET_RESTAURANT_GIFT_CARDS,
  payload: id
});
