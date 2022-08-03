const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../db");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/register", (req, res) => {
    const data = req.body;
    console.log(data);
    db.insertUser(data.first, data.last, data.email, data.password)
        .then((result) => {
            console.log("registration worked");
            console.log(result);
            // log result, find the user id value, and store it in a cookie!\

            //res.cookie("registered_user_cookie", result.rows[0].id);
            req.session.userId = result.rows[0].id;
            res.json({ success: true });
            // res.redirect("/");
        })
        .catch((err) => {
            console.log("An error occured", err);
            const error = {
                message:
                    "Something went wrong !!Are you sure , that u filled all fields properly?",
            };
            res.json({ success: false });
            res.render("/", {
                title: "Something went wrong . Pls try again",
                error,
            });
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
