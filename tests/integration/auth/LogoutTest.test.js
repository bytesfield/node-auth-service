const Helper = require("../../helpers/Helper");
const urlPrefix = "/api/auth";
const UserFactory = require("../../../src/database/factories/UserFactory");
const { authUser } = require("../../helpers/TestCase");
const cryptoRandomString = require("crypto-random-string");

const helper = new Helper();
const userFactory = new UserFactory();


describe("Logout Test", () => {

    it("Should not logout and throw error if token is empty", async () => {

        await userFactory.create();

 
         const { res } = await helper.apiServer
                                     .post(`${urlPrefix}/logout`);

         expect(res.statusCode).toEqual(404);
         expect(res.statusMessage).toBe("Not Found");
     }, 80000);

    it("Should not logout and throw error if token is not valid", async () => {

       await userFactory.create();

        const token = cryptoRandomString({length: 56, type: 'base64'});

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/logout`)
                                    .set('auth-token', token);
        expect(res.statusCode).toEqual(409);
        expect(res.statusMessage).toBe("Conflict");
    }, 80000);

    it("Should log user out", async () => {

        const user = await userFactory.create();
        
        const password = 'Password@123';

        const token = await authUser(user.email, password);

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/logout`)
                                    .set('auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

});