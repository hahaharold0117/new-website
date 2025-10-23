import { call, put, takeEvery } from "redux-saga/effects";
import { AuthTypes } from "./actionTypes";
import { setAuthToken } from "../../helpers/api_helper";
import { customerLoginAsync, customerSignupAsync } from '../../helpers/backend_helper'
import { loginSuccess, loginFail, signupSuccess, signupFail } from './actions'

function* customerLogin({ payload }) {
  try {
     const customerData = payload;
    console.log('customerData =>', customerData)
    const response = yield call(customerLoginAsync, customerData);
    console.log('response =>', response)
    if (response.auth) {
      localStorage.setItem("accessToken", response.accessToken);
      setAuthToken(response.accessToken);
      localStorage.setItem("authUser", JSON.stringify(response?.loggedInCustomer));
      yield put(loginSuccess(response?.loggedInCustomer));
    } else {
      yield put(loginFail(response));
    }
  } catch (error) {
    console.log('error =>', error)
      yield put(loginFail(error?.response?.data?.reason));
  }
}


function* customerSignup({ payload }: any) {
  try {
    const res: any = yield call(customerSignupAsync, payload);
    if (res?.success) {
      yield put(signupSuccess(res?.result));
    } else {
      yield put(signupFail(res?.message || "Signup failed"));
    }
  } catch (err: any) {
    yield put(signupFail(err?.response?.data?.message || err?.message || "Signup failed"));
  }
}

function* authSaga() {
  // @ts-ignore
  yield takeEvery(AuthTypes.CUSTOMER_LOGIN, customerLogin);
  yield takeEvery(AuthTypes.CUSTOMER_SIGNUP, customerSignup);
}

export default authSaga;


