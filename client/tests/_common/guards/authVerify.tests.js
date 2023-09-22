import "@testing-library/jest-dom"
import {render, screen} from "@testing-library/react"
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import App from "../../../App";
import store from "../../../_store/store"

test('temp test', async () =>{
    let tokenCleared = false;
    const localStorageMock = {
        getItem: (key) => {
            expect(key).toBe("jwtToken");
            return undefined;
        },
        setItem: (key, value) => {
            expect(key).toBe("jwtToken");
            expect(tokenCleared).toBe(false);
            expect(value).toBe("");
            tokenCleared = false;
        }
    };

    Object.defineProperty(window, 'localStorage', {value: localStorageMock});

    const history = createMemoryHistory();
    render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>);

    expect(tokenCleared).toBe(false);
    history.push("/Competitions");
    expect(tokenCleared).toBe(true)
})