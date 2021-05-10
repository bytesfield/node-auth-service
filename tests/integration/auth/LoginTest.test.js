const Helper = require("../../helpers/Helper");
const urlPrefix = "/api/auth";
const UserFactory = require("../../../src/database/factories/UserFactory");

const helper = new Helper();

describe("Login Test", () => {

    const userFactory = new UserFactory();

    const rightCredentials = {
        email : "codeflashtech@gmail.com",
        password : "Password@123"
    }
    const wrongCredentials = {
        email : "codeflashtech",
        password : "Password",
    }

    it("Should login user with right credentials", async () => {

        await userFactory.create();

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/login`)
                                    .send(rightCredentials);
        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Should not user login with wrong credentials", async () => {

        const user = await userFactory.create();

        console.log(user);

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/login`)
                                    .send(wrongCredentials);

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);

    it("Should not login InActive User", async () => {

        await userFactory.create('pending');

        const { res } = await helper.apiServer
                                    .post(`${urlPrefix}/login`)       
                                    .send(rightCredentials);

        expect(res.statusCode).toEqual(401);
        expect(res.statusMessage).toBe("Unauthorized");
    }, 80000);

});