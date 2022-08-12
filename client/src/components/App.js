import { Component } from "react";

import Logo from "./Logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader.js";
import Profile from "./Profile.js";
// import BioEditor from "./BioEditor";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FindPeople from "./FindPeople.js";
import OtherProfile from "./other-profile";
import Button from "./Button.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            username: "Buckwheat",
            first: "",
            last: "",
            url: "",
            bio: "",
        };
        this.togglePopup = this.togglePopup.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeProfilePic = this.changeProfilePic.bind(this);
        this.saveDraftBio = this.saveDraftBio.bind(this);
    }

    componentDidMount() {
        console.log("Component Mounted");
        // fetch informartion from the server

        fetch("/UserInfo")
            .then((answer) => answer.json())
            .then((User) => {
                console.log(
                    "here I am console loging the whole user data ",
                    User
                );

                this.setState({
                    first: User.first,
                    last: User.last,
                    url: User.url,
                    bio: User.bio,
                });
            });
    }

    changeName(newName) {
        this.setState({ username: newName });
    }

    changeProfilePic(pic) {
        this.setState({ url: pic });
    }

    togglePopup() {
        this.setState({ isPopupOpen: !this.state.isPopupOpen });
    }
    saveDraftBio(draftBio) {
        this.setState({ bio: draftBio });
    }
    render() {
        return (
            <div>
                <nav className="horizontalNav">
                    <Logo />

                    <ProfilePic
                        togglePopup={this.togglePopup}
                        changeName={this.changeName}
                        picture={this.state.url}
                    />
                </nav>
                <nav className="uploader">
                    {this.state.isPopupOpen && (
                        <Uploader
                            username={this.state.username}
                            changeProfilePic={this.changeProfilePic}
                            togglePopup={this.togglePopup}
                        />
                    )}
                </nav>
                <BrowserRouter>
                    <Route exact path="/">
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            bio={this.state.bio}
                            picture={this.state.url}
                            togglePopup={this.togglePopup}
                            saveDraftBio={this.saveDraftBio}
                        />
                        {/* <Button /> */}
                        <Link to="/users">Find other users</Link>
                    </Route>
                    <Route path="/user/:id">
                        <OtherProfile />
                        <Button />
                    </Route>
                    <Route path="/users">
                        <FindPeople />
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}
