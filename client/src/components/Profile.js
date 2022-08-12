import ProfilePic from "./profilePic";
// import { Component } from "react";
// import { BrowserRouter, Route, Link } from "react-router-dom";
import BioEditor from "./BioEditor";

export default function Profile({
    first,
    last,
    userId,
    picture,
    bio,
    toggleModal,
    saveDraftBio,
}) {
    return (
        <div className="profile">
            <ProfilePic
                picture={picture}
                first={first}
                last={last}
                userId={userId}
                togglePopup={toggleModal}
            />
            <div className="userinfo">
                <h2>
                    Hello {first} {last}
                </h2>
                <BioEditor
                    saveDraftBio={saveDraftBio}
                    bio={bio}
                    first={first}
                    last={last}
                />
            </div>
        </div>
    );
}
