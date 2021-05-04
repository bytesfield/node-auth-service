const nodemailer = require("nodemailer");
const mg = require('nodemailer-mailgun-transport');

let secrets;
if (process.env.APP_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const mailgunAuth = {
    auth: {
         api_key : secrets.MAILGUN_SECRET,
         domain : secrets.MAILGUN_DOMAIN,
    },
    host: secrets.EMAIL_HOST
    //proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
}

const emailServiceAuth = {

    host: secrets.EMAIL_HOST,
    port: secrets.EMAIL_PORT,
    secure: true,
    auth: {
        user: secrets.EMAIL_USERNAME,
        pass: secrets.EMAIL_PASSWORD,

    },
}

const emailService = nodemailer.createTransport(emailServiceAuth);
const mailgunService = nodemailer.createTransport(mg(mailgunAuth));




module.exports = { 
    emailService,
    mailgunService
}
