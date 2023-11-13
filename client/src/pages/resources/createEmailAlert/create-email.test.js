/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../../_store/store';

import App from './create-email';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Create Email", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Create Email");

        expect(title).toBeTruthy();
    })
});