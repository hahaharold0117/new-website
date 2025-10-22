import { all, fork } from "redux-saga/effects"
import bucketSaga from "./bucket/saga"
import menuSaga from "./menu/saga"
import authSaga from "./auth/saga"

export default function* rootSaga() {
  yield all([
    fork(bucketSaga),
    fork(menuSaga),
    fork(authSaga)
  ])
}
