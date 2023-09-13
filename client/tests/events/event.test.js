/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../src/_store/store';
import App from '../../src/events/event';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Competitions", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Competitions");

        expect(title).toBeTruthy();
    })
});