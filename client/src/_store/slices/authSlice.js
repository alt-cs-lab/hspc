import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import auth from "../../_common/services/auth";
import { updateErrorMsg } from "./errorSlice";

const token = localStorage.jwtToken
const initialState =  {user : token ? jwt_decode(token) : null};

export const login = createAsyncThunk(
    "auth/login",
    async ({email, password}, thunkApi) => {
        try{
            const data = await auth.login(email, password);
            return { user: data }
        } catch (error) {
            thunkApi.dispatch(updateErrorMsg(error.message))
            return thunkApi.rejectWithValue();
        }
    })

export const logout = createAsyncThunk(
    "auth/logout",
    async () => { auth.logout() })

const authReducers = createSlice({
    name: "auth",
    initialState: initialState,
    extraReducers : {
        [login.fulfilled]: (state, action) => {
            state.user = action.payload.user
        },
        [logout.fulfilled]: (state, action) => {
            state.user = null
        }
    }
})

export const selectAuth = state => {
    return {
        user: state.auth.user || {},
        isAuthenticated: !!state.auth.user,
        schoolDropdownRequired: false
    }
}

export default authReducers.reducer