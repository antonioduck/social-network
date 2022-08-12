import { Component } from "react";
import Registration from "./Registration.js";
import Login from "./Login.js";
import ResetPassword from "./ResetPassword.js";
// import Profile from "./Profile.js";

import { BrowserRouter, Route } from "react-router-dom";
export default class Welcome extends Component {
    render() {
        return (
            <>
            
                <img src="logo.jpg" alt="" />

                <BrowserRouter>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/resetpassword">
                        <ResetPassword />
                    </Route>

                    {/* <Route  path="/">
                        <Profile />
                    </Route> */}
                </BrowserRouter>
            </>
        );
    }
}
