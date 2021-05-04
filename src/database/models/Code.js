const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secretCode = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

//Model
const Code = mongoose.model('Code', secretCode);

module.exports = Code;
