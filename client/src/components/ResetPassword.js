import { Component } from "react";
import { Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component
class ResetPassword extends Component {
    constructor() {
        super(); //calls the constructor of the parent class. Used to access some variables in the parent

        this.state = {
            email: "",
            password: "",
            code: "",
            errorMessage: "",
            // successMessage: "",
            error: false,
            view: 1,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.startResetPassword = this.startResetPassword.bind(this);
    }
    // we see when info is being entered in the input field
    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
        //console.log("this.setState: ", this.setState);
    }

    // when submitting the form
    onFormSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
        };
        fetch("/resetpassword/start.json", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                //render error conditionally
                if (!data.success && data.message) {
                    this.setState({ errorMessage: data.message });
                } else {
                    this.setState({ errorMessage: data.message });
                    this.setState({ view: 2 });
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }

    startResetPassword(e) {
        e.preventDefault();

        const userData = {
            password: this.state.password,
            code: this.state.code,
            email: this.state.email,
        };
        fetch("/resetpassword/verify.json", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                //render error conditionally
                if (!data.success && data.message) {
                    this.setState({ errorMessage: data.message });
                } else {
                    this.setState({ errorMessage: data.message });
                    this.setState({ view: 3 });
                    // location.href = "/";
                    //console.log("view: ", this.view);
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }

    currentView() {
        if (this.state.view === 1) {
            return (
                <>
                    <form
                        id="resetForm"
                        method="post"
                        action="/resetpassword/start.json"
                        onSubmit={this.onFormSubmit}
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.onFormInputChange}
                        ></input>

                        <input
                            id="resetButton"
                            type="submit"
                            value="send"
                        ></input>
                    </form>

                    {this.state.errorMessage && (
                        <p className="error">{this.state.errorMessage}</p>
                    )}
                    <div>
                        <p>Go back to login</p>
                        <p>
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </>
            );
        } else if (this.state.view === 2) {
            return (
                <>
                    <form
                        id="verifyPasswordForm"
                        method="post"
                        action="/resetpassword/verify.json"
                        onSubmit={this.startResetPassword}
                    >
                        <input
                            type="text"
                            name="code"
                            placeholder="Code"
                            value={this.state.code}
                            onChange={this.onFormInputChange}
                        ></input>

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.onFormInputChange}
                        ></input>

                        <input
                            id="verifyPasswordButton"
                            type="submit"
                            value="send"
                        ></input>
                    </form>

                    {this.state.errorMessage && (
                        <p className="error">{this.state.errorMessage}</p>
                    )}
                </>
            );
        } else if (this.state.view === 3) {
            return (
                <>
                    <h2>Your password has successfully changed!</h2>
                    <p>Go to the login page</p>
                    <p>
                        <Link to="/login">Login</Link>
                    </p>
                </>
            );
        }
    }
    render() {
        return (
            <div id="resetPage">
                <h2>Reset your password here</h2>

                <div>{this.currentView()}</div>
            </div>
        );
    }
}

export default ResetPassword;
