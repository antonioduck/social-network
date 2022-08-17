import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    acceptFriend,
    rejectFriend,
    receiveFriendsAndWannabes,
} from "../redux/friends/slice";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();

    // very important!
    // it allows the DOM to react to changes in Redux data!
    const wannabes = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );
    console.log("wannabes from global state: ", wannabes);
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );
    console.log("friends from the global state", friends);
    useEffect(() => {
        // if (!wannabes) {
        (async () => {
            const res = await fetch("/findpossiblefriendships");
            const data = await res.json();

            console.log(
                "the data I am getting back after the /findpossiblefriendships are :",
                data
            );

            dispatch(receiveFriendsAndWannabes(data));
        })();
        // }
    }, []);
    // const friends = ...

    // function to accept a single user
    // param: user's id!
    const handleAccept = async (id) => {
        try {
            const res = await fetch("acceptfriendrequest", {
                method: "POST",
                headers: { "Content-Type": "application/json " },
                body: JSON.stringify({ otherUserId: id }),
            });
            const data = await res.json();

            console.log("the data that I am getting back is ", data);

            const action = acceptFriend(id);
            dispatch(action);
        } catch (err) {
            console.log(err);
        }
    };
    const handleReject = async (id) => {
        try {
            const res = await fetch("cancelfriendship", {
                method: "POST",
                headers: { "Content-Type": "application/json " },
                body: JSON.stringify({ otherUserId: id }),
            });
            const data = await res.json();

            console.log(
                "the data that I am getting back  after handle reject is ",
                data
            );

            const action = rejectFriend(id);
            dispatch(action);
        } catch (err) {
            console.log(err);
        }
    };

    // load data from server and pass it to redux
    // only when the component first loads!
    // useEffect(() => {
    // - fetch friend data (wannabes & friends) from server
    // - pass it to redux
    // - redux will update our data, because we use useSelector above!
    // `data` is fetched server data.

    // ...
    //     dispatch(receiveFriendsAndWannabes(data));
    // }, []);

    return (
        <div>
            <nav className="wannabees">
                <h2>Wannabes</h2>
                {wannabes.map((wannabe) => {
                    return (
                        <div key={wannabe.id}>
                            <img
                                src={wannabe.url}
                                alt=""
                                className="welcomeImage"
                            />
                            <br />
                            <p>
                                {wannabe.first} {wannabe.last}
                            </p>

                            <button
                                onClick={() => {
                                    handleAccept(wannabe.id);
                                }}
                            >
                                Accept
                            </button>
                        </div>
                    );
                })}
            </nav>
            <nav className="MyFriends">
                <h2>Friends</h2>
                {friends.map((friend) => {
                    return (
                        <div key={friend.id}>
                            <img
                                src={friend.url}
                                alt=""
                                className="welcomeImage"
                            />
                            <br />
                            <p>
                                {friend.first} {friend.last}
                            </p>

                            <button
                                onClick={() => {
                                    handleReject(friend.id);
                                }}
                            >
                                Delete Friend
                            </button>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
