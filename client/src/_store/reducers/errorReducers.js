import {CLEAR_ERRORS, GET_ERRORS, UPDATE_ERROR_MSG, UPDATE_SUCCESS_MSG, CLEAR_SUCCESS} from "../actions/types";

const initialState = {
  errorMsg: "",
  successMsg: "",
};
export default function errorReducers(state = initialState, action) {
    switch (action.type) {
      case UPDATE_ERROR_MSG:
            return {
                ...state,
                errorMsg: action.payload,
            };
      case UPDATE_SUCCESS_MSG:
        return {
            ...state,
            successMsg: action.payload,
        };
      case GET_ERRORS:
          return action.payload;
      case CLEAR_ERRORS:
        return{
          ...state,
          errorMsg: "",
          successMsg: "",
        };
      case CLEAR_SUCCESS:
        return{
          ...state,
          successMsg: "",
        };
      default:
          return state;
    }
}
