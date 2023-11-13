/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

/**
 * This is legacy and is not being used yet
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../../_store/store';

import App from '../../home/news';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe("News", () => {
    it("Should render page", () => {
        render(<App />, {wrapper: Wrapper});

        const title = screen.getByText("Create News");

        expect(title).toBeTruthy();
    })
});