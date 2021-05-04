const MemoryDatabaseServer = require('../src/config/MemoryDatabaseServer');

module.exports = async () => {
  await MemoryDatabaseServer.stop();
};

/* Note:
globalTeardown is a path to a module which exports an async function that is triggered once after all test suites.
*/