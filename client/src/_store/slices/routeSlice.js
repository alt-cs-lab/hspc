import VolunteerDash from "../../dashboards/volunteer";
import JudgeDash from "../../dashboards/judge";
import AdvisorDash from "../../dashboards/advisor";
import AdminDash from "../../dashboards/admin";
import MasterDash from "../../dashboards/master";
import { Route } from "react-router-dom";
import StartJudging from "../../judging/startJudging";
import { selectAuth } from "./authSlice";
const constants = require('../../_utilities/constants');


const dashboardRoutes = {
    "/volunteer/volunteerdash": {
        element: <VolunteerDash />,
        accessLevel: (constants.VOLUNTEER),
        requireExact: true
    },
    "/judge/judgedash": {
        element: <JudgeDash />,
        accessLevel: (constants.JUDGE),
        requireExact: false
    },
    "/advisor/advisordash": {
        element: <AdvisorDash />,
        accessLevel: (constants.ADVISOR),
        requireExact: true
    },
    "/admin/admindash": {
        element: <AdminDash />,
        accessLevel: (constants.ADMIN),
        requireExact: true
    },
    "/master/masterdash": {
        element: <MasterDash />,
        accessLevel: (constants.MASTER),
        requireExact: true
    }
}

const vounteerJudging = {
    "/volunteer/volunteerdash/startjudging": {
        element: <VolunteerDash />,
        accessLevel: (constants.VOLUNTEER),
        requireExact: true
    },
    "/volunteer/startjudging": {
        element: <StartJudging />,
        accessLevel: (constants.JUDGE),
        requireExact: false
    }
}

const routes = {
    dashboardRoutes: dashboardRoutes,
    protectedRoutes: {
        ...dashboardRoutes,
        ...vounteerJudging
    }
}

export function getProtectedRoute(route) {
    return routes.protectedRoutes[route.pathname];
}

export const protectedRouteElements = (() => {
    let key = 0;
    return Object.entries(routes.protectedRoutes)
        .map(([route, details]) => <Route path={route} element={details.element} key={key++} />)
    })();

export const selectDashboardRoute = state => {
    const auth = selectAuth(state);
    if (!auth.isAuthenticated) {
        return "/login"
    }

    const result = Object.entries(routes.dashboardRoutes)
        .filter(([_, val]) => {
            return val.accessLevel === auth.user.accessLevel
        })

    return result.length === 1 ? result[0][0] : "/login"
}