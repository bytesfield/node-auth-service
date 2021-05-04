const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        min : 6,
        max : 255
    },
    lastname : {
        type : String,
        required : true,
        min : 6,
        max : 255
    },
    email : {
        type : String,
        required : true,
        unique:true,
        lowercase : true,
        min : 6,
        max : 255
    },
    password : {
        type : String,
        required : true,
        min : 6,
        max : 1024
    },
    role: {
        type: String,
        default: "user",
    },
    status: {
        type: String,
        default: "pending",
    }

}, {timestamps : true});

//Model
const User = mongoose.model('User', userSchema);

module.exports = User;