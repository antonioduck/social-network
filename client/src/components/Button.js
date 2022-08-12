import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

export default function Button() {
    const [friendshipState, setFriendshipState] = useState(
        "Make Friendship Request"
    );
    let { id } = useParams();

    function handleClick() {
        console.log(`about to ask for info on user '${id}'`);
        const url = `/friendship/action/${id} `;
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({ userBio }),
        })
            .then((response) => response.json())
            .then((data) => {
                setFriendshipState("Cancel Request");
                console.log(
                    "the data I am getting back after the fetch in  handle click are: ",
                    data
                );
            });
    }

    return (
        <>
            <button onClick={handleClick}> {friendshipState} </button>
        </>
    );
}
