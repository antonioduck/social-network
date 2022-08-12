const aws = require("aws-sdk");
// const fs = require("fs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets stuff

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendTheCodeEmail = function (code) {
    return ses
        .sendEmail({
            Source: "Funky Chicken <dented.course@spicedling.email>",
            Destination: {
                ToAddresses: ["dented.course@spicedling.email"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `You forgot your password, but no worries about that .You can use this code to reset it: ${code}`,
                    },
                },
                Subject: {
                    Data: "Here is the code to reset your password",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
