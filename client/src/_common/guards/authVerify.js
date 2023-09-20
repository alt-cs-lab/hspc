import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { logout } from "../../_store/slices/authSlice";

export default function AuthVerify(props) {
    let location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token || jwtDecode(token).exp * 1000 < Date.now()) {
            dispatch(logout());
        }
    }, [location, dispatch]);
}