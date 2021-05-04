require('dotenv').config();

const databaseHelper = require('../src/app/modules/database');

beforeAll(() => {
  return databaseHelper.connect();
});

beforeEach(() => {
  return databaseHelper.truncate();
});

afterAll(() => {
  return databaseHelper.disconnect();
});

/* Note:
setupFilesAfterEnv is a list of paths to modules that run some code to configure or set up the testing framework before each test.
*/