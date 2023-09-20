/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

import App from '../src/App';

describe("App", () => {
  it("Should render page", () => {
      render(<App />);

      const title = screen.getByText("Welcome To Kansas State University");

      expect(title).toBeTruthy();
  })
})