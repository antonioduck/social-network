import { Component } from "react";
import "./Login.css";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
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
            email: this.email,
            password: this.password,
        };
        if (this.checkInputFields(body)) {
            body = JSON.stringify(body);
            fetch("/login", {
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
            console.log("wrong credentials");
        }
    }

    checkInputFields() {
        return true;
    }
    render() {
        return (
            <div>
                <form
                    className="Login"
                    method="post"
                    onSubmit={this.onFormSubmit}
                >
                    <h1>Login</h1>

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

                    <input type="submit" value="login"></input>
                    {this.state.error && (
                        <span className="error">Please try again</span>
                    )}
                </form>
            </div>
        );
    }
}
