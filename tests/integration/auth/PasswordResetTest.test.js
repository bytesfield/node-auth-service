const Helper = require("../../helpers/Helper");
const urlPrefix = "/api/auth";
const UserFactory = require("../../../src/database/factories/UserFactory");

const helper = new Helper();
const userFactory = new  UserFactory();

describe("Register Test", () => {


    it("Test can not get password reset code without providing email", async () => {

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({});

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Test can not get password reset code if email doest not exist", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({ email : 'example@emaple.com'});

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Test can get password reset code if email exist", async () => {

        const user = await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({ email : user.email});

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Test can not reset password if payload is empty", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send({});

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Test can not reset password if payload is empty", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send({});

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

});