import { BucketActionTypes } from "./actionTypes";

export const INIT_STATE: any = {
  bucket_items: [],
  error: {},
  loading: false,
  success: false,
};

const bucket = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case BucketActionTypes.ADD_BUCKET_ITEM:
      return {
        ...state,
        bucket_items: [...state.bucket_items, action.payload],
      };
    default:
      return state;
  }
};

export default bucket;
