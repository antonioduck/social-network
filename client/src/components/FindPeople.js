import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const onSearchInputChange = (e) => {
        const newInput = e.currentTarget.value;
        setSearchQuery(newInput);
    };

    useEffect(() => {
        let allowUpdate = true;
        const queryString = searchQuery
            ? `?${new URLSearchParams({ name: searchQuery })}`
            : "";
        fetch(`/api/find-users${queryString}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && allowUpdate) {
                    setUsers(data.users);
                }
            })
            .catch();
        return () => {
            allowUpdate = false;
        };
    }, [searchQuery]);

    return (
        <div className="find-people">
            <h1>Find People</h1>
            <div className="search">
                <label htmlFor="people-search">Try someones name here:</label>
                <input
                    type="text"
                    id="people-search"
                    value={searchQuery}
                    onChange={onSearchInputChange}
                />
            </div>
            <div className="user-results">
                {users.map((user) => {
                    return (
                        <Link
                            to={`/user/${user.id}`}
                            key={user.id}
                            className="user-result"
                        >
                            <img
                                src={user.url}
                                alt={`${user.first} ${user.last}'s profile pic`}
                            />
                            <h3>
                                {user.first} {user.last}
                            </h3>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
