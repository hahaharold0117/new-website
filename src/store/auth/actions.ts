import { AuthTypes } from "./actionTypes";

export const loginCustomer = (customerData) => ({
  type: AuthTypes.CUSTOMER_LOGIN,
  payload: customerData
});

export const loginSuccess = (data) => ({
  type: AuthTypes.CUSTOMER_LOGIN_SUCCESS,
  payload: data
});

export const loginFail = (error) => ({
  type: AuthTypes.CUSTOMER_LOGIN_FAILED,
  payload: error
});

export const clearLoginFlag = () => ({ type: AuthTypes.CUSTOMER_LOGIN_CLEAR });

export const signupCustomer = (payload) => ({ type: AuthTypes.CUSTOMER_SIGNUP, payload });
export const signupSuccess  = (customer) => ({ type: AuthTypes.CUSTOMER_SIGNUP_SUCCESS, payload: customer });
export const signupFail     = (err) => ({ type: AuthTypes.CUSTOMER_SIGNUP_FAILED, payload: err });
export const clearSignupFlag = () => ({ type: AuthTypes.CUSTOMER_SIGNUP_CLEAR });