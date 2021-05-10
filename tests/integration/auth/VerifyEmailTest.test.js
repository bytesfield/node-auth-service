const Helper = require("../../helpers/Helper");
const { authUser } = require("../../helpers/TestCase");
const UserFactory = require("../../../src/database/factories/UserFactory");
const CodeFactory = require("../../../src/database/factories/CodeFactory");
const urlPrefix = "/api/auth";

const helper = new Helper();

describe("Verify Email Test", () => {

    const userFactory = new UserFactory();
    const codeFactory = new CodeFactory();

    it("Should verify user email", async () => {

        const user = await userFactory.create();

        const code = await codeFactory.create(user.email);
        const secretCode = code.code;

        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Should not verify email is user does not exist", async () => {

        const userId = '609405a3016ff2732fa110ae' ;

        const code = await codeFactory.create('example@example.come');
        const secretCode = code.code;

        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${userId}/${secretCode}`);

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Should not verify email if Activation link has expired or already used", async () => {

        const user = await userFactory.create();

        const code = await codeFactory.create(user.email);
        const secretCode = code.code;

        await code.deleteOne();
        
        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);

        expect(res.statusCode).toEqual(403);
        expect(res.statusMessage).toBe("Forbidden");
    }, 80000);


    it("Should verify email activation link was sent", async () => {

        const user = await userFactory.create();
        
        const password = 'Password@123';

        const token = await authUser(user.email, password);

        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/get-activation-email`)
                                    .set('auth-token', token);

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

});