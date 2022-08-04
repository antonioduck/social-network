const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");

const cookieSession = require("cookie-session");
const SESSION_SECRET =
    process.env.SESSION || require("./secrets.json").SESSION_SECRET;

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // const data = req.body;
    console.log("req.body in register is :", req.body);
    db.insertUser(firstName, lastName, email, password)
        .then((result) => {
            console.log("registration worked");
            console.log(result);
            // log result, find the user id value, and store it in a cookie!\

            //res.cookie("registered_user_cookie", result.rows[0].id);
            req.session.userId = result.rows[0].id;
            res.json({ error: false });
            // res.redirect("/");
        })
        .catch((err) => {
            console.log("An error occured", err);

            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("req.body in login is :", req.body);
    db.authenticateUser(email, password)
        .then((user) => {
            console.log("logged in ", user);
            // console.log(user.rows[0].id);
            // req.session.userID = user.id;
            // if(req.session.userID)
            let userId = user.id;
            req.session.userID = userId;
            res.json({ error: false });
        })
        .catch((err) => {
            console.log("error in logging in ", err);

            res.json({ error: true });
        });
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
