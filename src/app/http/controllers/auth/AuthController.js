const path = require('path');
const cryptoRandomString = require("crypto-random-string");
const User = require('../../../../database/models/User');
const Code = require('../../../../database/models/Code');
const JsonResponse = require('../../../modules/JsonResponse');
const Helpers = require('../../../modules/Helpers');
const requestValidation = require('../../requests/RequestValidation');
const { httpStatus } = require('../../../../config/status');
const authRepository = require('../../repositories/AuthRepository');


let jsonResponse = new JsonResponse();
let helpers = new Helpers();

const signTokenExpiry = {
    expiresIn: 60 * 60 * 24 * 14,
}

/**
   * User Registration
   * @param {object} req
   * @param {object} res
   * 
   * @returns {object} User 
*/
const register = async (req, res, next ) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    // Validate request
    const { error } = requestValidation.registerValidation(req.body);
   
    if(error){
        return res.status(httpStatus.VALIDATION_ERROR)
            .send(jsonResponse.failedValidation('Failed Validation',error.details[0].message));
    }
    //Validate Password
    const validPassword = helpers.validatePassword(password);

    if(!validPassword){
        return res.status(httpStatus.VALIDATION_ERROR)
                    .send(jsonResponse
                    .failedValidation('Password must be at least 6 characters, a lowercase and uppercase letter, a numeric and special character.'));
        
    }

    try {
        //Check Email Exist
        const emailExist = await authRepository.getUserByEmail(email);

        if(emailExist){
            return res.status(httpStatus.CONFLICT)
                        .send(jsonResponse.error('Email already exist'));
        }

        //Hash Password
        const hashedPassword = await authRepository.hashPassword(password);

        const payload = {
            firstname : firstname,
            lastname : lastname,
            email : email,
            password : hashedPassword

        }

        //Saves user to database
        const user = await authRepository.createUser(payload);

        const user_id = user._id;

        //Create Token
        const signTokenData = {
            _id: user_id,
        }

        const signTokenSecret = res.locals.secrets.JWT_SECRET;
      
        const token  = await authRepository.createToken(signTokenData, signTokenSecret, signTokenExpiry);

        req.session.token = token;

        const baseUrl = req.protocol + "://" + req.get("host");
        
        const secretCode = cryptoRandomString({
            length: 6,
        });

        const codePayload = {
            code: secretCode,
            email: user.email,
        }
        //Create Code
        const code = await authRepository.createCode(codePayload);
        
        //get the absolute path to the view template with the file extension specified.
        let emailVerificationPath = path.resolve('./src/views/email/auth/emailVerification.ejs');
        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let verificationData  = {
            baseUrl: baseUrl,
            userId: user_id,
            secretCode : secretCode

        };
        const emailFrom = `${res.locals.secrets.APP_NAME} <${res.locals.secrets.EMAIL_USERNAME}>`;
        const emailTo = user.email;
        const emailSubject = "Your Activation Link for YOUR APP";
        const emailTemplate = {
            name: emailVerificationPath,
            engine: 'ejs',
            context: verificationData
          }
        
        //Send Verification Email
        await authRepository.sendEmail(emailFrom,emailTo,emailSubject,emailTemplate);
        

        return res.status(httpStatus.OK)
            .send(jsonResponse.success('Registration Successful, Check Email for Activation Link', user));

    }catch(err){

        console.log("Error on /api/auth/register: ", err);

        res.status(httpStatus.CONFLICT)
            .send(jsonResponse.error('Error occured', err));

    }

}

/**
   * User Login
   * @param {object} req
   * @param {object} res
   * 
   * @returns {string} token 
*/
const login = async (req, res ) => {

    const email = req.body.email;
    const password = req.body.password;

    // Validate request
    const { error } = requestValidation.loginValidation(req.body);
   
    if(error){
        return res.status(httpStatus.VALIDATION_ERROR)
            .send(jsonResponse.failedValidation('Failed Validation',error.details[0].message));
    }
    
    const user = await authRepository.getUserByEmail(email);;
    
    //Check User Exist
    if(!user){
        return res.status(httpStatus.CONFLICT)
            .send(jsonResponse.error('Email or password is wrong'));
    }

    const userStatus = user.status;

    //Check if password is correct
    const isValidPassword = await authRepository.validPassword(password, user.password);
    if(!isValidPassword){
        return res.status(httpStatus.CONFLICT)
            .send(jsonResponse.error('Invalid Email or Password'));
    }

    if(userStatus != "active"){
        return res.status(httpStatus.UNAUTHORIZED)
            .send(jsonResponse.unauthorized('User Account not active, please activate account'));
    }

    const signTokenData = {
        _id: user._id,
    }

    //Create and assign token
    const signTokenSecret = res.locals.secrets.JWT_SECRET;
    const token = await authRepository.createToken(signTokenData, signTokenSecret, signTokenExpiry);
    tokenData = [{
        token : token
    }]
    res.header('auth-token', token)
        .send(jsonResponse.success('Logged in Successfully', tokenData));
    
}

/**
   * User Get Activation Email
   * @param {object} req
   * @param {object} res
   * 
   * @returns {object} User 
*/

const getActivationEmail =  async (req, res) => {
    const baseUrl = req.protocol + "://" + req.get("host");

    try {
        const userId = req.user._id
        const user = await authRepository.getUserById(userId);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.error('User not found'));
        }
        await Code.deleteMany({ email: user.email });

        const secretCode = cryptoRandomString({
                length: 6,
        });

        const codePayload = {
            code: secretCode,
            email: user.email,
        }
        //Create Code
        await authRepository.createCode(codePayload);

            //get the absolute path to the view template with the file extension specified.
        let emailVerificationPath = path.resolve('./src/views/email/auth/emailVerification.ejs');
        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let verificationData  = {
            baseUrl: baseUrl,
            userId: user._id,
            secretCode : secretCode

        };

        const emailFrom = `${res.locals.secrets.APP_NAME} <${res.locals.secrets.EMAIL_USERNAME}>`;
        const emailTo = user.email;
        const emailSubject = "Your Activation Link for YOUR APP";
        const emailTemplate = {
            name: emailVerificationPath,
            engine: 'ejs',
            context: verificationData
          }
        
        //Send Verification Email
        await authRepository.sendEmail(emailFrom,emailTo,emailSubject,emailTemplate);
        
        return res.status(httpStatus.OK)
            .send(jsonResponse.success('Successful, Check Email for Activation Link', user));

    } catch (err) {
        console.log("Error on /api/auth/get-activation-email:: ", err);

        res.status(httpStatus.CONFLICT)
            .send(jsonResponse.error('Error occurred', err));

    }
}

/**
   * User verifies email
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const verifyAccount =  async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.error('User not found'));
        } 

        const response = await Code.findOne({
            email: user.email,
            code: req.params.secretCode,
        });

        if (!response) {
            return res.status(httpStatus.FORBIDDEN)
                .send(jsonResponse.forbidden('Activation Link is expired or used already'));
        } 
        const activateUser = await User.updateOne(
            { email: user.email },
            { status: "active" }
        );
        const deleteUserCode = await Code.deleteMany({ email: user.email });

        if(activateUser && deleteUserCode){

            return res.status(httpStatus.OK)
                .send(jsonResponse.success('Account Activated you can proceed to login'));

        }
        return res.status(httpStatus.CONFLICT)
            .send(jsonResponse.error('Something went wrong'));


    
    } catch (err) {
        console.log(
            "Error on /api/auth/verification/verify-account: ",
            err
        );
        return res.status(httpStatus.SERVER_ERROR).
            send(jsonResponse.error('Something went wrong'));
    }
}

/**
   * User get Password Reset Code
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const passWordResetGetCode = async (req, res) => {

    const { email } = req.body;

    // Validate request
    const { error } = requestValidation.emailValidation(req.body);

    if(error){
        return res.status(httpStatus.VALIDATION_ERROR)
            .send(jsonResponse.failedValidation('Failed Validation',error.details[0].message));
    }

    try {
        const user = await authRepository.getUserByEmail(email);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.notFound('The provided email address is not registered!'));
        }
        const secretCode = cryptoRandomString({
            length: 6,
        });

        const codePayload = {
            code: secretCode,
            email: email,
        }
        //Create Code
        const code = await authRepository.createCode(codePayload);

        //get the absolute path to the view template with the file extension specified.
        let passwordResetEmailPath = path.resolve('./src/views/email/auth/passwordResetVerification.ejs');
        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let passwordResetData  = {
            userName: user.firstname,
            secretCode : secretCode

        };

        const emailFrom = `${res.locals.secrets.APP_NAME} <${res.locals.secrets.EMAIL_USERNAME}>`;
        const emailTo = email;
        const emailSubject = "Your Password Reset Code";
        const emailTemplate = {
            name: passwordResetEmailPath,
            engine: 'ejs',
            context: passwordResetData
          }
        
        //Send Password Reset Code to email
        await authRepository.sendEmail(emailFrom,emailTo,emailSubject,emailTemplate);
        

        res.status(httpStatus.OK)
            .send(jsonResponse.success('Password reset code Sent to your registered email'));
            
    } catch (err) {
        console.log("Error on /api/auth/password-reset/get-code: ", err);
        return res.status(httpStatus.SERVER_ERROR).
            send(jsonResponse.error('Something went wrong. Please try again!'));
    }
}

/**
   * User Reset Password
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json 
*/
const passWordResetVerify = async (req, res) => {
    const { email, password, code } = req.body;
    // Validate request
    const { error } = requestValidation.passwordResetValidation(req.body);

    if(error){
        return res.status(httpStatus.VALIDATION_ERROR)
            .send(jsonResponse.failedValidation('Failed Validation',error.details[0].message));
    }
    //Validate Password
    const validPassword = helpers.validatePassword(password);

    if(!validPassword){
        return res.status(httpStatus.VALIDATION_ERROR)
        .send(jsonResponse.failedValidation('Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.'));
        
    }
    try {
        const user = await authRepository.getUserByEmail(email);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.notFound('The provided email address is not registered!'));
        }

        const response = await Code.findOne({ email, code });

        if (!response) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.notFound('The entered code is not correct. Please make sure to enter the code in the requested time interval.'));
        }
        //Hash Password
        const newHashedPassword = await authRepository.hashPassword(password);

        await User.updateOne({ email }, { password: newHashedPassword });
        await Code.deleteOne({ email, code });

        return res.status(httpStatus.OK)
            .send(jsonResponse.success('Password updated Successfully'));
        
    } catch (err) {
        console.log("Error on /api/auth/password-reset/verify: ", err);

        return res.status(httpStatus.SERVER_ERROR)
            .send(jsonResponse.error('Something went wrong. Please try again!'));
    }
}

/**
   * User Logout
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const logout = async (req, res) =>{

    req.session = null;
    res.status(httpStatus.OK)
            .send(jsonResponse.success('Logout Successfully'));
}

/**
   * User Delete Account
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const deleteAccount = async (req, res) => {
    const { password } = req.body;
    const user_id = req.user._id;

    //Request Validation
    const { error } = requestValidation.passwordValidation(req.body);

    if(error){
        return res.status(httpStatus.VALIDATION_ERROR)
            .send(jsonResponse.failedValidation('Failed Validation',error));
    }

    try {
        const user = await authRepository.getUserById(user_id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND)
                .send(jsonResponse.notFound('User not found',error.details[0].message));
        }
        const passwordCheckSuccess = await authRepository.validPassword(password, user.password);

        if (!passwordCheckSuccess) {

            return res.status(httpStatus.CONFLICT)
                .send(jsonResponse.error('The provided password is not correct'));
        }
        const deletedUser = await User.deleteOne({
            email: user.email,
        });

        return res.status(httpStatus.OK)
                .send(jsonResponse.success('Account deleted Successfully'));
        
    } catch (err) {
        console.log("Error on /api/auth/delete-account: ", err);

        return res.status(httpStatus.SERVER_ERROR)
            .send(jsonResponse.error('Something went wrong. Please try again!'));
        
    }
    
}


module.exports = {
    register,
    login,
    getActivationEmail,
    verifyAccount,
    passWordResetGetCode,
    passWordResetVerify,
    logout,
    deleteAccount
}