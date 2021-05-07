const Helper = require("../../helpers/Helper");
const { authUser } = require("../../helpers/TestCase");
const UserFactory = require("../../../src/database/factories/UserFactory");
const cryptoRandomString = require("crypto-random-string");
const urlPrefix = "/api/auth";

const helper = new Helper();
const userFactory = new  UserFactory();

describe("Delete Account Test", () => {

    it("Should not delete account if token is not passed to the request header", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/delete-account`)
                                    .send({ password : 'Password@123'});

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Should not delete account if user authentication token is not valid", async () => {

        const user = await userFactory.create();

        const token = cryptoRandomString({length: 56, type: 'base64'});

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/delete-account`)
                                    .set('auth-token', token)
                                    .send({ password : 'Password@123'});

        expect(res.statusCode).toEqual(409);
        expect(res.statusMessage).toBe("Conflict");
    }, 80000);


    it("Should not delete account if user password not correct", async () => {

        const user = await userFactory.create();

        const password = 'Password@123';

        const token = await authUser(user.email, password);

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/delete-account`)
                                    .set('auth-token', token)
                                    .send({ password : 'Password@1'});

        expect(res.statusCode).toEqual(409);
        expect(res.statusMessage).toBe("Conflict");
    }, 80000);

    it("Should delete account", async () => {

        const user = await userFactory.create();
        
        const password = 'Password@123';

        const token = await authUser(user.email, password);

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/delete-account`)
                                    .set('auth-token', token)
                                    .send({ password : password});

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);



});