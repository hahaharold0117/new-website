import { BucketActionTypes } from "./actionTypes";

export const INIT_STATE: any = {
  bucket_items: [],
  error: {},
  loading: false,
  success: false,
};

const bucket = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case BucketActionTypes.GET_RESTAURANT_GIFT_CARDS:
      return {
        ...state,
        loading: true,
      };

    case BucketActionTypes.GET_RESTAURANT_GIFT_CARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        bucket_items: action.payload,
      };
    default:
      return state;
  }
};

export default bucket;
