import axios from "axios";
import { updateErrorMsg } from "../slices/errorSlice";

export const registerUser = (userData, router) => dispatch => {
    axios
        .post("/api/user/register", userData)
        .then(res => { router.navigate("/login"); }) // re-direct to login on successful register
        .catch(err => {
            console.log("register catch", err.response.data);
            dispatch(updateErrorMsg(err.response.data))
        });
};