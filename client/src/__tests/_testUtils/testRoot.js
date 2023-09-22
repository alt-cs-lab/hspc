import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "../../App";
import store from "../../_store/store";

const TestRoot = ({ children }) =>
    <Provider store={store}>
        <HashRouter>
            <App />
            {children}
        </HashRouter>
    </Provider>

export default TestRoot;