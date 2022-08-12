import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

export default function OtherProfile() {
    const history = useHistory();
    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    let { id } = useParams();

    useEffect(() => {
        let allowUpdate = true;
        console.log(`about to ask for info on user '${id}'`);
        const url = `/api/user/${id}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // console.log(
                //     "the data I am recieving after the fetch is ",
                //     data
                // );
                if (data.success) {
                    allowUpdate && setUser(data.user);
                } else if (data.self) {
                    history.push("/");
                } else {
                    history.replace("/");
                }
            });
        return () => {
            allowUpdate = false;
        };
    }, [id]);

    const altText = `${user.first} ${user.last}`;

    return (
        <div className="profile">
            {error && <div className="error">{error}</div>}
            {!error && (
                <>
                    <img
                        className="profile-pic-large"
                        src={user.Url}
                        alt={altText}
                    />
                    <div className="user-info">
                        <h1>
                            {user.first} {user.last}
                        </h1>
                        <p>{user.bio}</p>
                    </div>
                </>
            )}
        </div>
    );
}
