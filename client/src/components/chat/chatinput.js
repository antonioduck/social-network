// client/src/components/chat/chatInput.js
// import { Textarea, Button, Label } from "flowbite-react";
import { useRef } from "react";
import { socket } from "../../socket";

const ChatInput = ({
    buttonTitle = "Send",
    textPlaceholder = "Write a message",
}) => {
    const textareaRef = useRef();

    const sendMessage = () => {
        const message = textareaRef.current.value;
        // console.log("the new message is:", message);
        socket.emit("new-message", {
            
            text: message,
        });

        textareaRef.current.value = "";
        textareaRef.current.focus();
    };

    const onChange = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            sendMessage();
        }
    };

    return (
        <div className="chatInput">
            <textarea
                rows={3}
                ref={textareaRef}
                placeholder={textPlaceholder}
                onKeyUp={onChange}
            ></textarea>
            <br />
            <button onClick={sendMessage}>{buttonTitle}</button>
        </div>
    );
};

export default ChatInput;
