const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const compression = require("compression");
const csurf = require("csurf");


dotenv.config();

if (process.env.APP_ENV == "production") {
    secrets = process.env;
    port = process.env.APP_PORT;
} else {
    secrets = require("./src/config/secrets");
    port = secrets.APP_PORT;
}

//Database Connection
require('./src/config/MongoDbConnection');

//Declare our Express App
const app = express();

// #Middleware
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(compression());
app.use(cors());

app.use((req, res, next) => {
    res.locals.secrets = secrets;
    next();
});

// #CSRF security for Production
if (process.env.NODE_ENV == "production") {
    app.use(csurf());
    app.use((req, res, next) => {
        res.set("x-frame-options", "DENY");
        res.cookie("mytoken", req.csrfToken());
        next();
    });
}



const server = app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = server;