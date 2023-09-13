/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../_store/store';

import App from './create-scoreboard';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Create Scoreboard", () => {
    it("Should render page", () => {
        const title = render(<App />, {wrapper: Wrapper});

        expect(title).toBeTruthy();
    })
});