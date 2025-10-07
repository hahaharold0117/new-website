import { combineReducers } from "redux"
import bucket from './bucket/reducer';
import menu from './menu/reducer'

const rootReducer = combineReducers({
  bucket,
  menu
})

export default rootReducer
