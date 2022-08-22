import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import rootReducer from "./redux/reducer.js";
import { composeWithDevTools } from "redux-devtools-extension";
import { init } from "./socket.js";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// const elem = (
//     <Provider store={store}>
//         <App />
//     </Provider>
// );

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    })
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
