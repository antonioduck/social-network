import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import Login from "./Login";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <div>
                    <img src="/logo.jpg" alt="logo" />
                </div>,
                document.querySelector("main")
            );
        }
    })
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
