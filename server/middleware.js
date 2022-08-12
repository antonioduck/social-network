const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function to upload files

// destination is the place where we store the newly updated files > in the uploads folder
// filename is the name we give to each uploaded file > created with uidSafe

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            const extension = path.extname(file.originalname);
            const newFileName = uid + extension;
            callback(null, newFileName); // null bacause no errors in this callback
        });
    },
});

module.exports.uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});


module.exports.ensureSignedOut = (req, res, next) => {
    if (req.session.userId) {
        return res.json({
            success: false,
            message: "Already signed in",
        });
    }
    next();
};

module.exports.ensureSignedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.json({
            success: false,
            message: "You are not signed in",
        });
    }
    next();
};

module.exports.validateRegistration = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    let message;
    if (!firstName) {
        message = "First name can't be empty";
    } else if (!lastName) {
        message = "Last name can't be empty";
    } else if (!email) {
        message = "Email can't be empty";
    } else if (!password) {
        message = "Password can't be empty";
    }
    if (message) {
        return res.json({
            success: false,
            message,
        });
    }
    next();
};

module.exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    let message;
    if (!email) {
        message = "Email can't be empty";
    } else if (!password) {
        message = "Password can't be empty";
    }
    if (message) {
        return res.json({
            success: false,
            message,
        });
    }
    next();
};
