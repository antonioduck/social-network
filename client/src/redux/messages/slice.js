const messagesReducer = (messages = [], action) => {
    switch (action.type) {
                    case "/messages/received":
                        console.log("/messages/received", action);
                        return action.payload;

                    case "/message/received":
                        return [...messages, action.payload];

                    default:
                        return messages;
    }
};

export function messagesReceived(messages) {
    return {
        type: "/messages/received",
        payload: messages,
    };
}

export function messageReceived(message) {
    return {
        type: "/message/received",
        payload: message,
    };
}

export default messagesReducer;
