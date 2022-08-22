import { combineReducers } from "redux";
import friendsAndWannabesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
// you need to import your friendsWannabesReducer here!

const rootReducer = combineReducers({
    friends: friendsAndWannabesReducer,
    messages: messagesReducer,
});

export default rootReducer;
