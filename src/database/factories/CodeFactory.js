const authRepository = require('../../app/http/repositories/AuthRepository');
const cryptoRandomString = require("crypto-random-string");


class CodeFactory {


    async create(email){
        const secretCode = cryptoRandomString({
            length: 6,
        });
        
        const payload = {
            code: secretCode,
            email: email,
        }
        //Create Code
        const code = await authRepository.createCode(payload);

        return code;
    }

}

module.exports = CodeFactory;