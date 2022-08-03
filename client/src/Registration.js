import { Component } from "react";
import "./Registration.css";

export default class Registration extends Component {
    render() {
        return (
            <form id="registration" method="post"  >
                <h1>Registration</h1>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" onChange={this.onFormInputChange}></input>

                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName"></input>

                <label htmlFor="email">E-Mail</label>
                <input type="email" name="email"></input>

                <label htmlFor="password">Password</label>
                <input type="password" name="password"></input>

                <input type="submit" value="Register"></input>
            </form>
        );
    }
}


// onFormInputChange(e)
// const userData ={

//     firstName :this.state.firstName;
//     lastName: this.stats.lastName;

// }