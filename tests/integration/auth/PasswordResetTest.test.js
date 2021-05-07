const Helper = require("../../helpers/Helper");
const UserFactory = require("../../../src/database/factories/UserFactory");
const CodeFactory = require("../../../src/database/factories/CodeFactory");
const urlPrefix = "/api/auth";

const helper = new Helper();
const userFactory = new  UserFactory();
const codeFactory = new  CodeFactory();

describe("Register Test", () => {

    it("Should not get password reset code without providing email", async () => {

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({});

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Should not get password reset code if email doest not exist", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({ email : 'example@emaple.com'});

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Should get password reset code if email exist", async () => {

        const user = await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/get-code`)
                                    .send({ email : user.email});

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Should not reset password if payload is empty", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send({});

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Should not reset password if inputted password is not a valid ", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);

        const payload = {
            email : user.email,
            password : 'Password',
            confirm_password : 'Password',
            code : code.code
        }

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send(payload);

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Should not reset password if inputted email does not exists", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);

        const payload = {
            email : 'example@xample.com',
            password : 'Password@123',
            code : code.code,
            confirm_password : 'Password@123'
        }

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send(payload);

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Should not reset password if inputted code does not exists", async () => {

        const user = await userFactory.create();
        const email = user.email;
        await codeFactory.create(email);

        const payload = {
            email : email,
            code : '12837',
            password : 'Password@123',
            confirm_password : 'Password@123'
        }

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send(payload);

        expect(res.statusCode).toEqual(404);
        expect(res.statusMessage).toBe("Not Found");
    }, 80000);

    it("Should reset password", async () => {

        const user = await userFactory.create();
        const email = user.email;
        const code = await codeFactory.create(email);

        const payload = {
            email : email,
            code : code.code,
            password : 'Password@123',
            confirm_password : 'Password@123'
        }

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/password-reset/verify`)
                                    .send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

});