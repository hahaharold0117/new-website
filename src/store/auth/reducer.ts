import { AuthTypes } from "./actionTypes";

export const INIT_STATE: any = {
  authCustomer: null,
  error: "",
  loading: false,
  login_success: false,
  signup_success: false,
};

const auth = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AuthTypes.CUSTOMER_LOGIN:
      return {
        ...state,
        loading: true,
        error: "",
        login_success: false,
      };
    case AuthTypes.CUSTOMER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        login_success: true,
        authCustomer: action.payload
      };

    case AuthTypes.CUSTOMER_LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        login_success: false
      };


    case AuthTypes.CUSTOMER_LOGIN_CLEAR:
      return { ...state, login_success: false, error: "" };

    case AuthTypes.CUSTOMER_SIGNUP:
      return { ...state, loading: true, error: "", signup_success: false };

    case AuthTypes.CUSTOMER_SIGNUP_SUCCESS:
      return { ...state, loading: false, error: "", signup_success: true };

    case AuthTypes.CUSTOMER_SIGNUP_FAILED:
      return { ...state, loading: false, error: action.payload || "Signup failed", signup_success: false };

    case AuthTypes.CUSTOMER_SIGNUP_CLEAR:
      return { ...state, signup_success: false, error: "" };

    default:
      return state;
  }
};

export default auth;
