// const spicedPg = require("spiced-pg");
// const username = "postgres";
// const password = "postgres";
// const database = "socialnetwork";
// const dbUrl =
//     process.env.DATABASE_URL ||
//     `postgres:${username}:${password}@localhost:5432/${database}`;
// const db = spicedPg(dbUrl);
// const bcrypt = require("bcryptjs");

/* eslint-disable no-unused-vars */

const bcrypt = require("bcryptjs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - local / heroku databases

let dbUrl;

if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.DATABASE_URL;
} else {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = require("./secrets.json");
    dbUrl = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets

let sessionSecret;

if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}

// Used for REGISTRATION
function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });

    // 1. Generate a salt
    // 2. Hash the password with the salt
    // 3. Return the hash
    // [PROMISE]
}

// Used for REGISTRATION
module.exports.insertUser = (firstName, lastName, email, password) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(
            `INSERT INTO users(first,last,email,password)
    VALUES($1,$2,$3,$4) RETURNING id`,
            [firstName, lastName, email, hashedPassword]
            // 1. Hash the user's password [PROMISE]
            // 2. INSERT into the database with a query
            // 3. Return the entire row
            // so that we can store the user's id in the session!
        );
    });
};

module.exports.findUserByEmail = (email) => {
    return db.query(`SELECT * FROM USERS WHERE EMAIL =$1`, [email]);
    // return db.query(....)
};

findUserByEmail = (email) => {
    return db.query(`SELECT * FROM USERS WHERE EMAIL =$1`, [email]);
    // return db.query(....)
};

module.exports.authenticateUser = (email, password) => {
    let foundUser;
    return findUserByEmail(email)
        .then((user) => {
            console.log("the whole object is ", user.rows);
            console.log(
                "[db.jd] user.rows in findUserByEmail",
                user.rows[0].password
            );
            if (user.rows.length < 1) {
                throw "email not found";
            }
            foundUser = user.rows[0];
            console.log(
                "the found user in Find user by e-mail is :",
                foundUser
            );
            const hashFromDb = user.rows[0].password;

            return bcrypt.compare(password, hashFromDb);
        })
        .then((result) => {
            if (result) {
                return foundUser;
            } else {
                throw "Incorrect password";
            }
        })
        .catch(() => {
            console.log("the passwords do not match ");
        });
};
module.exports.authenticateEmail = (email, password) => {
    let foundUser;
    return findUserByEmail(email)
        .then((user) => {
            console.log("the whole object is ", user.rows);
            // console.log(
            //     "[db.jd] user.rows in findUserByEmail",
            //     user.rows[0].password
            // );
            if (user.rows.length < 1) {
                throw "email was not found";
            }
            foundUser = user.rows[0];
            console.log(
                "the found user in Find user by e-mail is :",
                foundUser
            );

            return foundUser;
        })
        .then((result) => {
            console.log("the user we found was:", result);
        })
        .catch(() => {
            console.log(" wrong e-mail ");
        });
};

module.exports.addTheSecretCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes(email, code) VALUES ($1, $2) RETURNING *`,
        [email, code]
    );
};

module.exports.checkTheSecretCode = () => {
    return db.query(
        `SELECT code FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`
    );
};

module.exports.updateThePassword = (password, email) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(`UPDATE users SET password =$1 WHERE email = $2`, [
            hashedPassword,
            email,
        ]);
    });
};

module.exports.addProfilePic = (id, url) => {
    return db.query(`UPDATE users SET url=$2 WHERE id=$1;`, [id, url]);
};

module.exports.getUserInformation = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

module.exports.insertBio = (id, bio) => {
    return db.query(`UPDATE users SET bio=$2 WHERE id = $1 RETURNING *`, [
        id,
        bio,
    ]);
};
module.exports.findUsersByName = (name) => {
    const query = `
    SELECT id, email, first, last, bio, url
    FROM users
    WHERE first ILIKE $1 OR last ILIKE $1
    ORDER BY first, last
    LIMIT 5`;
    return db.query(query, [`%${name}%`]);
};

module.exports.getLatestUsers = (amount) => {
    const query = `
    SELECT id, first, last, url
    FROM users
    ORDER BY id DESC
    LIMIT $1
    `;
    return db.query(query, [amount]);
};

module.exports.findUser = (id) => {
    console.log(`finding user with id ${id}`);
    const query = `SELECT id, email, first, last, bio,url FROM users WHERE id = $1`;
    return db.query(query, [id]).then((result) => result.rows[0]);
};

module.exports.findFriendship = (user1id, user2id) => {
    return db.query(
        `SELECT * FROM friendships WHERE (sender_id= $1 AND recipient_id=$2) OR (sender_id = $2 AND recipient_id = $1)`,
        [user1id, user2id]
    );
};

module.exports.setFriendship = (user1id, user2id) => {
    return db.query(
        `INSERT INTO friendships(sender_id, recipient_id, accepted) VALUES ($1, $2, false) RETURNING *`,
        [user1id, user2id]
    );
};

module.exports.AcceptFriendship = (user1id, user2id) => {
    return (
        db.query(
            `UPDATE friendships SET accepted=TRUE WHERE (sender_id= $1 AND recipient_id=$2) RETURNING *`
        ),
        [user1id, user2id]
    );
};

module.exports.cancelFriendship = (user1id, user2id) => {
    return db.query(
        `DELETE FROM friendships WHERE (sender_id= $1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1)`,
        [user1id, user2id]
    );
};
