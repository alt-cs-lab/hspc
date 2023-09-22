import {combineReducers} from "redux";
import authReducer from "./authSlice";
import errorReducer from "./errorSlice";

export default combineReducers({
    errors: errorReducer,
    auth: authReducer
});