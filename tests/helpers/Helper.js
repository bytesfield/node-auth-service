const supertest = require("supertest");
const app = require("../../index");

class Helper {
    constructor(model) {
        this.apiServer = supertest(app);
    }

}

module.exports = Helper;