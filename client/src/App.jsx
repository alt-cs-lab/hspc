import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./home/homepage";
import Login from "./login/login";
import RequireAuth from "./_common/guards/privateRoute";

import Register from "./registration/create/user";
import Navbar from "./_common/components/top-navbar";
import Event from "./events/event";
import AuthVerify from "./_common/guards/authVerify";
import { protectedRouteElements } from "./_store/slices/routeSlice";

const App = () => {
    return (
        // TODO: Change to 'Container fluid' so the elements have proper space
        <div id="bootstrap-override">
            <Navbar/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/competitions" element={<Event/>}/>
                <Route element={<RequireAuth/>}>
                    {protectedRouteElements}
                </Route>
            </Routes>
            <AuthVerify />
        </div>
    );
}

export default App;
