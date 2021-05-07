const Helper = require("./Helper");
const urlPrefix = "/api/auth";

const helper = new Helper();

const authUser = async (email, password) => {


    const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/login`)
                                    .send({ email: email, password : password});
    const token = res.headers['auth-token'];
    
    return token;
    
}



module.exports = {
    authUser
}