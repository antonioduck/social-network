import { Component } from "react";

import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            error: false,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormInputChange(e) {
        this[e.currentTarget.name] = e.currentTarget.value;
    }

    onFormSubmit(e) {
        e.preventDefault();
        let body = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
        };
        if (this.checkInputFields(body)) {
            body = JSON.stringify(body);
            fetch("/register", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: body,
            })
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    if (!result.error) {
                        location.reload();
                    } else {
                        this.setState({ error: true });
                    }
                });
        } else {
            console.log("something is missing");
        }
    }

    checkInputFields() {
        return true;
    }
    render() {
        return (
            <>
                {/* <nav className="otherSide">
                    <p> hey hey</p>
                </nav> */}
                <nav className="Registration">
                    <div>
                        <p>
                            Welcome to my Social Network . This is a place where
                            all the dog owners can know each other . If you are
                            not a member , you can register here
                        </p>
                    </div>

                    <form
                        className="registration"
                        method="post"
                        onSubmit={this.onFormSubmit}
                    >
                        <h1>Registration</h1>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            onChange={this.onFormInputChange}
                        ></input>

                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            onChange={this.onFormInputChange}
                        ></input>

                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            name="email"
                            onChange={this.onFormInputChange}
                        ></input>

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={this.onFormInputChange}
                        ></input>

                        <input
                            type="submit"
                            className="submitbtn"
                            value="Register"
                        ></input>
                        {this.state.error && (
                            <span className="error">Please try again</span>
                        )}
                    </form>

                    <p>
                        <Link to="/login">Click here to Log in!</Link>
                    </p>
                </nav>
            </>
        );
    }
}
