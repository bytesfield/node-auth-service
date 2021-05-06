const authRepository = require('../../app/http/repositories/AuthRepository');


class UserFactory {

    async create(status = 'active'){
        //Hash Password
        const hashedPassword = await authRepository.hashPassword('Abkeys@1993');
    
        const payload = {
            firstname : 'Abraham',
            lastname : 'Udele',
            email : "codeflashtech@gmail.com",
            password : hashedPassword,
            status : status
        }
    
        //Saves user to database
        const user = await authRepository.createUser(payload);
        return user;
    
    }
}


module.exports = UserFactory;
