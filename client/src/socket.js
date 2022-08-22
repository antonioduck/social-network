import { io } from "socket.io-client";
import { messagesReceived, messageReceived } from "./redux/messages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last-10-messages", (messages) => {
            // messages should be an array
            console.log("got last 10 messages:", messages);

            store.dispatch(messagesReceived(messages));
        });

        socket.on("add-new-message", (message) => {
            store.dispatch(messageReceived(message));
        });
    }
};
