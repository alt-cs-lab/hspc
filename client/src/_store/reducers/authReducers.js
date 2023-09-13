import {
    SET_CURRENT_USER,
    USER_LOADING,
    SET_SCHOOL_DROPDOWN_REQUIRED
} from "../actions/types";

const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    schoolDropdownRequired: false,
};

export default function authReducers(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case SET_SCHOOL_DROPDOWN_REQUIRED:
            return {
                ...state,
                schoolDropdownRequired: action.payload,
            };
        default:
            return state;
    }
}