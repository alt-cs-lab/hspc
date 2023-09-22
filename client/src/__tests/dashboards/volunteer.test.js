/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../src/_store/store';

import App from '../../src/dashboards/volunteer';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Volunteer Dash", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Volunteer Portal");

        expect(title).toBeTruthy();
    })
});