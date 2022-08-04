const spicedPg = require("spiced-pg");
const username = "postgres";
const password = "postgres";
const database = "socialnetwork";
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${username}:${password}@localhost:5432/${database}`;
const db = spicedPg(dbUrl);
const bcrypt = require("bcryptjs");

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
