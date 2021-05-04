const User = require('../../../database/models/User');
const Code = require('../../../database/models/Code');
const { mailgunService } = require('../../../config/nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createUser = async (payload) => {
    const newUser = await new User(payload);
    await newUser.save();
    return newUser;
}

const createCode = async (payload) => {
    const newSecretCode = await new Code(payload);
    await newSecretCode.save();
    return newSecretCode;
}
const getUserByEmail = async (email) => {

    const user = await User.findOne({ email: email });
    return user;
}

const getUserById = async (id) => {

    const user = await User.findById(id);
    return user;
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const createToken = async (tokenData, tokenSecret, tokenExpiry) => {
    const token = await jwt.sign(tokenData,tokenSecret,tokenExpiry);
    return token;
}

const validPassword = async (password, inPassword) => {
    const isValidPassword = await bcrypt.compare(password, inPassword);
    return isValidPassword;
}

const sendEmail = async (from,to,subject,template) => {

    //Sends Email Activation Link
    const emailData = {
        from: from,
        to: to,
        subject: subject,
        text:'text',
        template: template
    };
    const sentEmail = await mailgunService.sendMail(emailData);
    return sentEmail;
}

module.exports = {
    createUser,
    createCode,
    sendEmail,
    getUserByEmail,
    hashPassword,
    createToken,
    validPassword,
    getUserById
}