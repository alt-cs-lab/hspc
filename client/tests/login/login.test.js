/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'

import { Provider } from 'react-redux';

import App from '../../src/login/login';
import store from '../../src/_store/store'

jest.mock("../../actions/authActions", () => ({
    loginUser: (userdata) => ({})
}));

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Login", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Returning User?");

        expect(title).toBeTruthy();
    })
})