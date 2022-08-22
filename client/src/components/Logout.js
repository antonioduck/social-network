// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useEffect } from "react";


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Logout component

function Logout() {


    useEffect(() => {
        fetch("/logout")
            .then(() => {
                //console.log("success in fetch after logout");
                //console.log("data: ", data);
                location.href = "/";
            })
            .catch((error) => {
                console.log("error on fetch after logout ", error);
            });
    }, []);

    return <></>;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Logout;
