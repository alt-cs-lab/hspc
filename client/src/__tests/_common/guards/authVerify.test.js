import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../../../App";
import store from "../../../_store/store";
import jwtDecode from "jwt-decode";
import "core-js";
import userEvent from "@testing-library/user-event";
import { HashRouter, MemoryRouter, Router } from "react-router-dom";
import TestRoot from "../../_testUtils/testRoot";

let tokenValue = undefined;

beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => { })
    global.Storage.prototype.getItem = jest.fn((key) => tokenValue)
    global.Storage.prototype.removeItem = jest.fn((key) => { })
})

beforeEach(() => {
    tokenValue = undefined;
})

afterAll(() => {
    // return our mocks to their original values
    // 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
    global.Storage.prototype.setItem.mockReset()
    global.Storage.prototype.getItem.mockReset()
    global.Storage.prototype.removeItem.mockReset()
})

jest.mock('jwt-decode');


const app = <Provider store={store}>
    <MemoryRouter>
        <App />
    </MemoryRouter>
</Provider>

describe("undefined token", () => {
    it("Should clear storage", async () => {
        render(<TestRoot />);

        await new Promise(process.nextTick);
        expect(global.Storage.prototype.removeItem).toHaveBeenCalledTimes(1);
    })
})

describe('initial expired token', () => {
    it("Should clear storage on initially expired token", async () => {
        tokenValue = "Bearer value";
        jwtDecode.mockReturnValue({
            accessLevel: 1,
            email: "test@mail.com",
            exp: 1,
            iat: 1,
            id: 1,
            name: "Test Name"
        })

        jest.useFakeTimers().setSystemTime(1001);

        render(app);
        await new Promise(process.nextTick);
        expect(global.Storage.prototype.removeItem).toHaveBeenCalledTimes(1);
    })
});

describe('token expires', () => {
    it("Should clear storage on route change", async () => {
        tokenValue = "Bearer value";
        jwtDecode.mockReturnValue({
            accessLevel: 1,
            email: "test@mail.com",
            exp: 1,
            iat: 1,
            id: 1,
            name: "Test Name"
        })
        const user = userEvent.setup();

        jest.useFakeTimers().setSystemTime(1000);
        const view = render(app)
        await new Promise(process.nextTick);

        jest.useFakeTimers().setSystemTime(1001);
        user.click(screen.getByText("Event"));
        view.rerender();
        await new Promise(process.nextTick);
        expect(global.Storage.prototype.removeItem).toHaveBeenCalledTimes(1);
    })
})

describe('token valid', () => {
    it("Should not clear storage", async () => {
        tokenValue = "Bearer value";
        jwtDecode.mockReturnValue({
            accessLevel: 1,
            email: "test@mail.com",
            exp: 1,
            iat: 1665264040,
            id: 1,
            name: "Test Name"
        })

        jest.useFakeTimers().setSystemTime(1000);
        render(app)
        await new Promise(process.nextTick);
        expect(global.Storage.prototype.removeItem).toHaveBeenCalledTimes(0);
    })
})
