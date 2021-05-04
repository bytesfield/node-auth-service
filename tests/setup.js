const MemoryDatabaseServer = require('../src/config/MemoryDatabaseServer');

module.exports = async () => {
  await MemoryDatabaseServer.start();
};

/* Note:
globalSetup is a path to a module which exports an async function that is triggered once before all test suites.
*/