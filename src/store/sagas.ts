import { all, fork } from "redux-saga/effects"
import bucketSaga from "./bucket/saga"

export default function* rootSaga() {
  yield all([
    fork(bucketSaga),
  ])
}
