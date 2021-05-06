# Node-Auth-Service

A Simple Token-Based User Authentication Service using JWT in Node JS and MongoDB.

# Description

With this you can quickly craft a token-based user authentication system using JWT and continue your project implementation. This comes with `User Registration`, `Email Verification`, `Login`, `Password Reset`, `Account Deletion`, `Logout`.

# Installation

### Step 1

Clone or download this repository to your machine:

- Clone the repo: `git clone https://github.com/bytesfield/node-auth-service.git`
- [Download from Github](https://github.com/bytesfield/node-auth-service/archive/refs/heads/main.zip).

### Step 2

`npm install` to install all application dependencies.

Update Environment variables, rename `.env.example` to `.env` and `secrets.json.example` in `config` folder to `secrets.json` then update `MDB_DATABASE_CONNECT` value to your MongoDB database connection and update `APP_PORT` to your desired port default is `3000`, also `APP_ENV` to `production` or `test` depending on your environment default is `test`.

For email configuration on `.env` or `secrets.json` files, update the `EMAIL` or `MAILGUN` credentials respectively depending on your mailing service. When using mailgun, export the `mailgunService` from the `nodemailer.js` in the `config` folder, while `emailService` if you are using a normal mailing service and pass the required parameters for sending mail.

Lastly update `JWT_SECRET` and `COOKIE_SESSION_SECRET` to your desired values.

### Step 3

Start your development server : `npm start` this serves the application to default `localhost:3000`

### Step 4

Open Postman run the Api endpoints. Documentation can be accessed below

Note: Use active emails for testing as you will receive emails to your inbox.

# Documentation

The API documentation is hosted on [Postman Doc](https://documenter.getpostman.com/view/10912779/TzRNGAEU)

# Contribution

Want to suggest some improvement on the codes? Make a pull request to the `dev` branch and it will be reviewed and possibly merged.
Find me on
<a href="https://twitter.com/SaintAbrahams/">Twitter.</a>
<a href="https://www.linkedin.com/in/abraham-udele-246003130/">Linkedin.</a>

# License

Source codes is license under the MIT license.
