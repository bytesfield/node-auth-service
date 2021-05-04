const Joi = require('joi');

//Register Validation
const registerValidation = (data) => {

    const registerSchema = Joi.object({

        firstname : Joi.string()
                  .max(255)
                  .required(),
        lastname : Joi.string()
                  .max(255)
                  .required(),
        email : Joi.string()
                   .min(6)
                   .required()
                   .email(),
        password : Joi.string()
                      .min(6)
                      //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                      .required(),
        confirm_password : Joi.ref('password')
    
    }).with('password', 'confirm_password');

    return registerSchema.validate(data);

}


const loginValidation = (data) => {

    const loginSchema = Joi.object({

        email : Joi.string()
                   .min(6)
                   .required()
                   .email(),
        password : Joi.string()
                      .min(6)
    
    });

    return loginSchema.validate(data);

}

const emailValidation = (data) => {

    const emailSchema = Joi.object({

        email : Joi.string()
                   .min(6)
                   .required()
                   .email(),
    
    });

    return emailSchema.validate(data);

}

const passwordValidation = (data) => {

    const passwordSchema = Joi.object({

        password : Joi.string()
                      .min(6)
                      .required(),
    
    });

    return passwordSchema.validate(data);

}

//Register Validation
const passwordResetValidation = (data) => {

    const passwordResetSchema = Joi.object({
        email : Joi.string()
                   .min(6)
                   .required()
                   .email(),
        code : Joi.required(),
        password : Joi.string()
                      .min(6)
                      .required(),
        confirm_password : Joi.ref('password')
    
    }).with('password', 'confirm_password');

    return passwordResetSchema.validate(data);

}


module.exports = {
    registerValidation,
    loginValidation,
    emailValidation,
    passwordResetValidation,
    passwordValidation
};
