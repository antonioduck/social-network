import { Component } from "react";
import Registration from "./Registration";
import Login from "./Login";

import { BrowserRouter, Route, Link } from "react-router-dom";
export default class Welcome extends Component {
    render() {
        return (
            <div>
                <p>Welcome to the page</p>
                <img src="/logo.jpg" />
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
