import { combineReducers } from "redux"
import bucket from './bucket/reducer';

const rootReducer = combineReducers({
  bucket,
})

export default rootReducer
