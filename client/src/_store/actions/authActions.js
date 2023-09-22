import axios from "axios";
import { updateErrorMsg } from "../slices/errorSlice";

export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/user/register", userData)
        .then(res => history.push("/login")) // re-direct to login on successful register
        .catch(err => {
            console.log("register catch", err.response.data.msg);
            dispatch(updateErrorMsg(err.response.data.msg))
        });
};