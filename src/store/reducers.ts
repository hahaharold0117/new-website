import { combineReducers } from "redux"
import bucket from './bucket/reducer';
import menu from './menu/reducer';
import auth from "./auth/reducer";

const rootReducer = combineReducers({
  bucket,
  menu,
  auth
})

export default rootReducer
