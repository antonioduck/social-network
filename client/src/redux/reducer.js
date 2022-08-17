import { combineReducers } from "redux";
import friendsAndWannabesReducer from "./friends/slice";
// you need to import your friendsWannabesReducer here!

const rootReducer = combineReducers({
    friends: friendsAndWannabesReducer,
});

export default rootReducer;
