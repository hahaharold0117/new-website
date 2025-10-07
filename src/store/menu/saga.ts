import { call, put, takeEvery } from "redux-saga/effects";
// import { getRestaurantGiftCardsSuccess } from "./actions";

// function* getRestaurantGiftCards({ payload: id}: any) {
//   try {
//     const response: any = yield call(getAllGiftCardsAsync, id);
//     if(response.success) {
//       // yield put(getRestaurantGiftCardsSuccess(response.result.sort((a:any, b:any) => a.id-b.id)));
//     } 
//   } catch (error) {
//     console.log(error)
//   }
// }

function* menuSaga() {
  // yield takeEvery(BucketActionTypes.GET_RESTAURANT_GIFT_CARDS, getRestaurantGiftCards)
}

export default menuSaga;


