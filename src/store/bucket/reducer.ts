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

    case BucketActionTypes.REMOVE_BUCKET_ITEM: {
      const idx = action.payload as number;
      return {
        ...state,
        bucket_items: state.bucket_items.filter((_, i) => i !== idx),
      };
    }

    case BucketActionTypes.CLEAR_BUCKET: {
      return {
        ...state,
        bucket_items: [],
      };
    }
    case BucketActionTypes.UPDATE_BUCKET_ITEM: {
      const { index, item } = action.payload;
      const next = state.bucket_items.map((x, i) => (i === index ? item : x));
      return { ...state, bucket_items: next };
    }
    default:
      return state;
  }
};

export default bucket;
