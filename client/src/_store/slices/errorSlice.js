import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errorMsg: "",
  successMsg: "",
};

const errorSlice = createSlice({
  name: "error",
  initialState: initialState,
  reducers: {
    updateErrorMsg: (state, action) => { state.errorMsg = action.payload; },
    updateSuccessMsg: (state, action) => { state.successMsg = action.payload;},
    clearErrors: (state) => { state.errorMsg = ""; state.successMsg = ""; },
  }
})

export const {updateErrorMsg, updateSuccessMsg, clearErrors} = errorSlice.actions;

export default errorSlice.reducer