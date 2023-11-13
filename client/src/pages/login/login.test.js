/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'

import TestRoot from '../../__tests/_testUtils/testRoot';
import { useLocation, useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import auth from "../../_common/services/auth";
import * as authSlice from "../../_store/slices/authSlice";

let navigate = undefined;
let pathName = undefined;
const RouteHelper = () => {
    navigate = useNavigate();
    pathName = useLocation().pathname;
}

describe("Login", () => {
    it("Should stay on login for unauthenticated.", () => {
        render(
            <TestRoot>
                <RouteHelper />
            </TestRoot>);

        act(() => {
            navigate("/login");
        })

        expect(pathName).toBe("/login");
    });

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
    ])("Should redirect to dashboard on login", async () => {
        const dashRoute = "/master/masterdash";
        const accessLevel = 100;
        auth.login = jest.fn().mockResolvedValue({
            accessLevel: accessLevel,
            email: "test@mail.com",
            exp: 100000000000,
            iat: 1665264040,
            id: 1,
            name: "Test Name"
        });

        render(
            <TestRoot>
                <RouteHelper />
            </TestRoot>
        );

        act(() => {
            navigate("/login");
        });

        fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@mail.com" } });
        fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() => expect(pathName).toBe(dashRoute))
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
    ])("Should redirect to dashboard if already signed in", async ({ dashRoute, accessLevel }) => {
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
            </TestRoot>
        );

        act(() => {
            navigate("/login");
        });


        expect(pathName).toBe(dashRoute);
    })
})

