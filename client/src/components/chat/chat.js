// client/src/components/chat/chat.js
import ChatBoard from "./chatboard";
import ChatInput from "./chatinput";
import { useSelector } from "react-redux";

const Chat = () => {
    const messages = useSelector((state) => state.messages);
    console.log("mesages on state are :", messages);
    return (
        <>
            <div>
                <ChatBoard messages={messages} />
                <br />
                <div>
                    <ChatInput buttonTitle="Senden" />
                </div>
            </div>
        </>
    );
};

export default Chat;
