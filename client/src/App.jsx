import React, {Component} from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./_store/store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./_utilities/setAuthToken";
import {setCurrentUser, logoutUser} from "./_store/actions/authActions";

import Home from "./home/homepage";
import Login from "./login/login";
import RequireAuth from "./_common/guards/privateRoute";

import Register from "./registration/create/user";
import Navbar from "./_common/components/top-navbar";
import Event from "./events/event";
import Scoreboard from "./scoring/scoreboard";

import StudentDash from "./dashboards/student";
import VolunteerDash from "./dashboards/volunteer";

import StartJudging from "./judging/volunteerAssignmentQuestion";
import JudgeDash from "./dashboards/judge";
import AdvisorDash from "./dashboards/advisor";
import AdminDash from "./dashboards/admin";
import MasterDash from "./dashboards/master";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded)); // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser()); // Redirect to login
        window.location.href = "./login";
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <HashRouter>
                    <div>
                        <Navbar/>
                        <Routes>
                            <Route exact path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>

                            <Route path="/competitions" element={<Event/>}/>
                            <Route element={<RequireAuth/>}>
                                <Route
                                    path="/master/masterdash"
                                    element={<MasterDash/>}
                                    requiredAccessLevel={100}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/student/studentdash"
                                    element={<StudentDash/>}
                                    requiredAccessLevel={1}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/volunteer/volunteerdash"
                                    element={<VolunteerDash/>}
                                    requiredAccessLevel={20}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/volunteer/volunteerdash/startjudging"
                                    element={<VolunteerDash/>}
                                    requiredAccessLevel={20}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/judge/judgedash"
                                    element={<JudgeDash/>}
                                    requiredAccessLevel={40}
                                    exactLevel={false}
                                />

                                <Route
                                    path="/volunteer/startjudging"
                                    element={<StartJudging/>}
                                    requiredAccessLevel={20}
                                    exactLevel={false}
                                />

                                <Route
                                    path="/advisor/advisordash"
                                    element={<AdvisorDash/>}
                                    requiredAccessLevel={60}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/admin/admindash"
                                    element={<AdminDash/>}
                                    requiredAccessLevel={80}
                                    exactLevel={true}
                                />

                                <Route
                                    path="/master/masterdash"
                                    element={<MasterDash/>}
                                    requiredAccessLevel={100}
                                    exactLevel={true}
                                />
                            </Route>
                        </Routes>
                    </div>
                </HashRouter>
            </Provider>
        );
    }
}

export default App;
