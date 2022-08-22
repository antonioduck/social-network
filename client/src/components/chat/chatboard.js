// client/src/components/chat/chatBoard.js
import ChatMessage from "./chatmessage";

const ChatBoard = ({ messages }) => {
    return (
        <div className="chatBoard">
            {messages.map((message) => (
                <ChatMessage key={Math.random()} message={message} />
            ))}
        </div>
    );
};

export default ChatBoard;
