import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { selectAuth } from "../../_store/slices/authSlice";
import { getProtectedRoute } from "../../_store/slices/routeSlice";


function RequireAuth(props) {
    const location = useLocation();
    const auth = useSelector(selectAuth);
    const route = getProtectedRoute(location);
    // const exactLevel = auth;
    // const requiredAccessLevel = -1;


    if (!auth.isAuthenticated ||
        (route.requireExact && auth.user.accessLevel !== route.accessLevel) ||
        (!route.requireExact && auth.user.accessLevel <= route.accessLevel)) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireAuth;
