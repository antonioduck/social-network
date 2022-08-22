// client/src/components/chat/chatMessage.js
const ChatMessage = ({ message }) => {
    return (
        <div className="chatMessage">
            <img className="tiny" src={message.url} alt="logo"></img>
            <br />
            <p>
                user {message.first}
                {message.last} said {message.message} at{" "}
                {new Date(message.created_at).toString().slice(0, 24)}
            </p>
        </div>
    );
};

export default ChatMessage;
