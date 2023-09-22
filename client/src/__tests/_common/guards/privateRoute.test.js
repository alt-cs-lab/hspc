import "@testing-library/jest-dom";
import { render, } from "@testing-library/react";
// import jwtDecode from "jwt-decode";
import "core-js";
import { useLocation, useNavigate } from "react-router-dom";
import { act } from "react-dom/test-utils";
import TestRoot from "../../_testUtils/testRoot";
import * as authSlice from "../../../_store/slices/authSlice";

let navigate;
let pathName;
const RouteHelper = () => {
    navigate = useNavigate();
    pathName = useLocation().pathname;
}

describe("Verified dash route", () => {
    beforeEach(() => {
        navigate = undefined;
        pathName = undefined;
    })
    it.each([
        {
            dashRoute: "/student/studentdash",
            accessLevel: 1
        },
        {
            dashRoute: "/volunteer/volunteerdash",
            accessLevel: 20
        },
        {
            dashRoute: "/advisor/advisordash",
            accessLevel: 60
        },
        {
            dashRoute: "/admin/admindash",
            accessLevel: 80
        },
        {
            dashRoute: "/master/masterdash",
            accessLevel: 100
        },
    ])
        ("Should access dash", ({ dashRoute, accessLevel }) => {
            authSlice.selectAuth = jest.fn().mockReturnValue({
                user: {
                    accessLevel: accessLevel,
                    email: "test@mail.com",
                    exp: 100000000000,
                    iat: 1665264040,
                    id: 1,
                    name: "Test Name"
                },
                isAuthenticated: true
            });

            render(
                <TestRoot>
                    <RouteHelper />
                </TestRoot>);

            act(() => {
                navigate(dashRoute);
            });

            expect(pathName).toBe(dashRoute)
        })

    it.each([
        {
            otherRoutes: [
                "/student/studentdash",
                "/volunteer/volunteerdash",
                "/advisor/advisordash",
                "/admin/admindash"
            ],
            dashRoute: "/master/masterdash",
            accessLevel: 100
        },
        {
            otherRoutes: [
                "/student/studentdash",
                "/volunteer/volunteerdash",
                "/advisor/advisordash",
                "/master/masterdash"
            ],
            dashRoute: "/admin/admindash",
            accessLevel: 80
        },
        {
            otherRoutes: [
                "/student/studentdash",
                "/volunteer/volunteerdash",
                "/admin/admindash",
                "/master/masterdash"
            ],
            dashRoute: "/advisor/advisordash",
            accessLevel: 60
        },
        {
            otherRoutes: [
                "/student/studentdash",
                "/advisor/advisordash",
                "/admin/admindash",
                "/master/masterdash"
            ],
            dashRoute: "/volunteer/volunteerdash",
            accessLevel: 20
        },
        {
            otherRoutes: [
                "/volunteer/volunteerdash",
                "/advisor/advisordash",
                "/admin/admindash",
                "/master/masterdash"
            ],
            dashRoute: "/student/studentdash",
            accessLevel: 1
        },

    ])
        ("Should direct to user's route", ({ otherRoutes, dashRoute, accessLevel }) => {
            for (const route of otherRoutes) {
                authSlice.selectAuth = jest.fn().mockReturnValue({
                    user: {
                        accessLevel: accessLevel,
                        email: "test@mail.com",
                        exp: 100000000000,
                        iat: 1665264040,
                        id: 1,
                        name: "Test Name"
                    },
                    isAuthenticated: true
                });

                render(
                    <TestRoot>
                        <RouteHelper />
                    </TestRoot>);

                // eslint-disable-next-line no-loop-func
                act(() => {
                    navigate(route);
                });

                expect(pathName).toBe(dashRoute);
            }
        })
})