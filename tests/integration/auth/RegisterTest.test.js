const Helper = require("../../helpers/Helper");
const testCase = require("../../helpers/TestCase");
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
    const payloadWrong = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech",
        password : "Abkeys",
        confirm_password : "Abkeys"
    }


    it("User can register with right credentials", async () => {

        const { res } = await helper.apiServer.post(`${urlPrefix}/register`).send(payload);

        expect(res.statusCode).toEqual(200);
    }, 80000);

    it("User can not register with wrong credentials", async () => {

        const { res } = await helper.apiServer.post(`${urlPrefix}/register`).send(payloadWrong);

        expect(res.statusCode).toEqual(422);
    }, 30000);
});