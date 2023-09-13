/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../_store/store';

import App from './advisors';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Advisors", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("*NOTE* Table only displays advisors who have selected their main school.");

        expect(title).toBeTruthy();
    })
});