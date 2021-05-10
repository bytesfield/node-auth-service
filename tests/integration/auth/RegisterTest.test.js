const Helper = require("../../helpers/Helper");
const helper = new Helper();
const urlPrefix = "/api/auth";

describe("Register Test", () => {

    const payload = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech@gmail.com",
        password : "Abkeys@1993",
        confirm_password : "Abkeys@1993"
    }
    const wrongPayload = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech",
        password : "Abkeys",
        confirm_password : "Abkeys"
    }

    it("Should register user with right credentials", async () => {

        const { res } = await helper.apiServer.post(`${urlPrefix}/register`).send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    }, 80000);

    it("Should not register user with wrong credentials", async () => {

        const { res } = await helper.apiServer.post(`${urlPrefix}/register`).send(wrongPayload);

        expect(res.statusCode).toEqual(422);
        expect(res.statusMessage).toBe("Unprocessable Entity");
    }, 80000);
});