import React from "react";
import {connect} from "react-redux";
import {Outlet, Navigate, useLocation} from "react-router-dom";


function RequireAuth(requiredAccessLevel,exactLevel, auth) {
    let location = useLocation();

    if (!auth.isAuthenticated || (exactLevel && auth.user.accessLevel !== requiredAccessLevel) || (!exactLevel && auth.user.accessLevel <= requiredAccessLevel)) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{from: location}}/>;
    }

    return <Outlet/>;
}

RequireAuth.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(RequireAuth);
