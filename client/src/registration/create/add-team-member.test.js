/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../_store/store';

import App from './add-team-member';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("Add Team member", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Add a Student");

        expect(title).toBeTruthy();
    })
});