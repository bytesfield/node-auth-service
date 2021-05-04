const NodeEnvironment = require('jest-environment-node');

const MemoryDatabaseServer = require('../src/config/MemoryDatabaseServer');

class CustomEnvironment extends NodeEnvironment {
    
  async setup() {
    await super.setup();

    this.global.__DB_URL__ = await MemoryDatabaseServer.getConnectionString();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;

/*
    testEnvironment is the test environment that will be used for testing.
*/