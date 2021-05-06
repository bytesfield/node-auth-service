const Helper = require("../../helpers/Helper");
const urlPrefix = "/api/auth";
const UserFactory = require("../../../src/database/factories/UserFactory");
const CodeFactory = require("../../../src/database/factories/CodeFactory");

const helper = new Helper();

describe("VerifyEmail Test", () => {

    const userFactory = new UserFactory();
    const codeFactory = new CodeFactory();


    it("Test User can verify email", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);
        const secretCode = code.code;

        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Test Not Found User cannot verify email", async () => {

        const userId = '609405a3016ff2732fa110ae' ;
        const code = await codeFactory.create('example@example.come');
        const secretCode = code.code;

        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${userId}/${secretCode}`);

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Test Activation link has expired or already used", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);
        const secretCode = code.code;

        await code.deleteOne();
        
        const { res } = await helper.apiServer
                                    .get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);

        expect(res.statusCode).toEqual(403);
        expect(res.statusMessage).toBe("Forbidden");
    }, 80000);

});