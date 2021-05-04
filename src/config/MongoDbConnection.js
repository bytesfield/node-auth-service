const mongoose = require("mongoose");

let mongoDBUrl;

if (process.env.APP_ENV == "production") {
    mongoDBUrl = process.env.MDB_DATABASE_CONNECT;
} else {
    const { MDB_DATABASE_CONNECT } = require("./secrets.json");
    mongoDBUrl = MDB_DATABASE_CONNECT;
}

mongoose
    .connect(mongoDBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("-----> mongoDB connected..."))
    .catch((err) =>
        console.log("-----> Error trying to connect to mongoDB: ", err)
    );

mongoose.connection.on(
    "error",
    console.error.bind(console, "-----> mongoDB connection error")
);
