import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function Button(otherUserId) {
    // const history = useHistory();
    const { id } = useParams();
    let [buttonInfo, setButtonInfo] = useState({});

    useEffect(() => {
        fetchFriendshipButton();
    }, [id]);

    function fetchFriendshipButton() {
        fetch(`/friendship/action/${id}`)
            .then((response) => response.json())
            .then((result) => {
                console.log(
                    "the results in friendship/action/:id are ",
                    result
                );
                if (result.rows.length == 0) {
                    setButtonInfo({
                        text: "Add  friend",
                        url: "/makefriendrequest",
                    });
                } else if (result.rows[0].accepted) {
                    setButtonInfo({
                        text: "Cancel the friendship",
                        url: "/cancelfriendship",
                    });
                } else if (
                    result.rows[0].recipient_id == id &&
                    !result.rows[0].accepted
                ) {
                    setButtonInfo({
                        text: "Delete friend",
                        url: "/cancelfriendship",
                    });
                } else if (
                    result.rows[0].sender_id == id &&
                    !result.rows[0].accepted
                ) {
                    setButtonInfo({
                        text: "Accept friend request",
                        url: "/acceptfriendrequest",
                    });
                }
            });
    }

    function useFriendshipButton() {
        let body = { otherUserId: id };
        console.log(body);
        body = JSON.stringify(body);
        fetch(`${buttonInfo.url}`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: body,
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                console.log("the results are ", result),
                fetchFriendshipButton();
            });
    }

    return <button className="myBtn" onClick={useFriendshipButton}>{buttonInfo.text}</button>;
}
