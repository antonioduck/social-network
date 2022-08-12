export default function ProfilePic({ togglePopup, picture, first, last }) {
    return (
        <>
            {/* <button onClick={togglePopup}>Toggle Popup</button>
            <button onClick={() => changeName("Spiced")}>Change Name</button> */}
            <img
                className="profilepic"
                src={picture || "EmptyPic.png"}
                alt={first + " " + last}
                onClick={togglePopup}
            />
        </>
    );
}
