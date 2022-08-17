export default function friendsAndWannabesReducer(friends = [], action) {
    if (action.type === "friends-and-wannabes/received") {
        friends = action.payload.friends;

        console.log("friends in main reducer are ", friends);
    } else if (action.type === "friends-and-wannabes/accept") {
        // const newFriends =
        // friends.map(/** do something with action.payload.id... */);

        const newFriends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });

        return newFriends;
    } else if (action.type === "friends-and-wannabes/reject") {
        // const newFriends =
        // friends.map(/** do something with action.payload.id... */);

        const newFriends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return {
                    ...friend,
                
                };
            } 
        });

        return newFriends;
    }

    return friends;
}

// Creators of actions
// You need 3 action creators, one for each type (as above)
// 1. use it to update the state with data from the server.
//    payload: all friends, from the server
// 2. payload: id of the friend we're accepting
// 3. payload: id of the friend we're unfriending

export function acceptFriend(id) {
    return {
        type: "friends-and-wannabes/accept",
        payload: { id },
    };
}
export function rejectFriend(id) {
    return {
        type: "friends-and-wannabes/reject",
        payload: { id },
    };
}

export function receiveFriendsAndWannabes(friends) {
    // ...
    return {
        type: "friends-and-wannabes/received",
        payload: { friends },
    };
}
