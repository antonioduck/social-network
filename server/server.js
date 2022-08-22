/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Stuff

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());

const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // to unpack JSON in the request body

const cryptoRandomString = require("crypto-random-string");

const ses = require("./ses");
const s3 = require("./s3");
const uploader = require("./middleware").uploader;

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) => {
        callback(null, req.headers.referer.startsWith("http://localhost:3000"));
    },
});

app.use(compression());
const cookieSessionMiddleware = cookieSession({
    secret:
        process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    sameSite: true,
});
app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
const {
    ensureSignedOut,
    ensureSignedIn,
    validateRegistration,
    validateLogin,
} = require("./middleware");

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
            req.session.userId = userId;
            res.json({ error: false });
        })
        .catch((err) => {
            console.log("error in logging in ", err);

            res.json({ error: true });
        });
});

app.post("/resetpassword/start.json", (req, res) => {
    if (!req.body.email) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize email
        req.body.email = req.body.email.toLowerCase();

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check User
        db.findUserByEmail(req.body.email)
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in findUserByEmail: email not found");
                    res.json({
                        success: false,
                        message:
                            "It looks like you don't have an account with us",
                    });
                } else {
                    console.log("Success in getUserInfo: email found");

                    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - generate and add secret code to db
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.addTheSecretCode(req.body.email, secretCode)
                        .then((results) => {
                            console.log("Success in the addSecretCode");
                            //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - send email
                            ses.sendTheCodeEmail(secretCode)
                                .then((result) => {
                                    console.log("Success in sendCodeEmail");
                                    res.json({
                                        success: true,
                                        message:
                                            "The code was sent successfully to your email",
                                    });
                                })
                                .catch((err) => {
                                    console.log("Error in sendCodeEmail", err);
                                    res.json({
                                        success: false,
                                        message:
                                            "Something went wrong, please try again",
                                    });
                                });
                        })
                        .catch((err) => {
                            "error in addSecretCode", err;
                            res.json({
                                success: false,
                                message:
                                    "Something went wrong, please try again",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log("error in getUserInfo", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - -
app.post("/resetpassword/verify.json", (req, res) => {
    if (!req.body.code || !req.body.password) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check Code
        db.checkTheSecretCode()
            .then((results) => {
                //console.log("results from checkSecretCode: ", results);
                let possibleCodes = results.rows;

                if (
                    possibleCodes[possibleCodes.length - 1].code ===
                    req.body.code
                ) {
                    db.updateThePassword(req.body.password, req.body.email)
                        .then((results) => {
                            console.log("success in updatePassword");
                            res.json({
                                success: true,
                                message:
                                    "Your password was updated successfully",
                            });
                        })
                        .catch((err) => {
                            console.log("error in upatePassword", err);
                            res.json({
                                success: false,
                                message:
                                    "Something went wrong, please try again",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        message: "Your code is not correct, please try again!",
                    });
                }
            })
            .catch((err) => {
                console.log("error in checkSecretCode", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/UserInfo/", (req, res) => {
    // console.log(
    //     "what I am getting back from req.session : ",
    //     req.session.userId
    // );

    db.getUserInformation(req.session.userId)
        .then((results) => {
            console.log("the result rows are ", results.rows);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getUserInformation", err);
        });
});

app.post("/image", uploader.single("photo"), s3.upload, (req, res) => {
    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

    db.addProfilePic(req.session.userId, url).then(() => {
        res.json({
            picture: url,
        });
    });
});

app.post("/insertTheBio.json", (req, res) => {
    console.log("the req.body from  insrertTheBio post is: ", req.body);
    db.insertBio(req.session.userId, req.body.userBio)
        .then((results) => {
            console.log("insertBio worked!");
            console.log("results:", results);
            var userBio = req.body.userBio;
            res.json({
                userBio,
                success: true,
            });
        })
        .catch((err) => {
            console.log("error in insertBio", err);
        });
});

app.get("/api/find-users", ensureSignedIn, (req, res) => {
    if (req.query.name) {
        return db
            .findUsersByName(req.query.name)
            .then((response) => response.rows)
            .then((users) => {
                return res.json({
                    success: true,
                    users,
                });
            })
            .catch((error) => {
                console.log("Error finding users by name: ", error);
                res.json({
                    success: false,
                });
            });
    } else {
        return db
            .getLatestUsers(3)
            .then((response) => response.rows)
            .then((users) => {
                return res.json({
                    success: true,
                    users,
                });
            })
            .catch((error) => {
                console.log("Error getting latest users: ", error);
                res.json({
                    success: false,
                });
            });
    }
});
app.get("/api/user/:id", ensureSignedIn, (req, res) => {
    const { id } = req.params;
    // console.log("asked for user with id ", id);
    db.findUser(id).then((user) => {
        if (user) {
            const self = id == req.session.userId;
            return res.json({
                self,
                success: !self,
                user: {
                    id: user.id,
                    first: user.first,
                    last: user.last,
                    email: user.email,
                    Url: user.url,
                    bio: user.bio,
                },
            });
        }
        return res.json({
            success: false,
        });
    });
});
app.get("/api/user", ensureSignedIn, (req, res) => {
    db.findUser(req.session.userId).then((user) => {
        if (user) {
            return res.json({
                success: true,
                user: {
                    id: user.id,
                    first: user.first,
                    last: user.last,
                    email: user.email,
                    Url: user.url,
                    bio: user.bio,
                },
            });
        }
        return res.json({
            success: false,
        });
    });
});

app.get("/friendship/action/:id", async (req, res) => {
    const user1id = req.session.userId;
    const user2id = req.params.id;

    // console.log(
    //     "the users I want to check in server are:",
    //     user1id + "and" + user2id
    // );

    res.json(await db.findFriendship(user1id, user2id));
});

app.post("/makefriendrequest", async (req, res) => {
    const user1id = req.session.userId;
    const user2id = req.body.otherUserId;

    res.json(await db.setFriendship(user1id, user2id));
});

app.post("/acceptfriendrequest", async (req, res) => {
    const user1id = req.session.userId;
    const user2id = req.body.otherUserId;

    console.log("the req.body  in acept friendship in server.js is ", req.body);
    const result = await db.acceptFriendship(user1id, user2id);
    res.json(result.rows);
});

app.post("/cancelfriendship", async (req, res) => {
    const user1id = req.session.userId;
    const user2id = req.body.otherUserId;

    res.json(await db.cancelFriendship(user1id, user2id));
});

// app.post("/deletefriendship", async (req, res) => {
//     const user1id = req.session.userId;
//     const user2id = req.body.otherUserId;

//     res.json(await db.cancelFriendship(user1id, user2id));
// });

app.get("/findpossiblefriendships", async (req, res) => {
    const myId = req.session.userId;
    let result = await db.FindPossibleFriends(myId);
    // console.log("the results from find possible friends are :", result);
    // db.FindPossibleFriends(myId).then((data) => {
    //     console.log(
    //         "the data I am getting back from Find possible friends is :",
    //         data
    //     );
    // });
    return res.json(result.rows);
});

app.get("/logout", (req, res) => {
    req.session = null;
    req.session.userId = null;
    return res.redirect("/");
});
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", async function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    console.log(
        `User with id: ${userId} and socket id ${socket.id}, just connected!`
    );

    app.get("/chat", async (req, res) => {});
    const theLastChats = await db.lastChats();
    console.log("the last 10 chats are: ", theLastChats.rows);

    socket.emit("last-10-messages", theLastChats.rows);

    // socket.emit("last-10-messages", [
    //     {
    //         text: "A first message",
    //     },
    //     {
    //         text: "A second message",
    //     },
    // ]);

    socket.on("new-message", (message) => {
        console.log("new-message", message);
        // const { first, url } = await db

        db.getUserInformation(userId).then((result) => {
            console.log("the result from grt user info is :", result.rows);
        });

        db.insertMessages(message.text, userId).then(() => {
            io.emit("add-new-message", message);
        });
        // io.emit("add-new-message", message.text);
    });
});
