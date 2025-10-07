import { all, fork } from "redux-saga/effects"
import bucketSaga from "./bucket/saga"
import menuSaga from "./menu/saga"

export default function* rootSaga() {
  yield all([
    fork(bucketSaga),
    fork(menuSaga)
  ])
}
