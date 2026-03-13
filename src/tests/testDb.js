const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

/**
 * Start an in-memory MongoDB server and connect Mongoose.
 * Falls back to mock mode if the binary cannot be downloaded.
 */
const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * Drop all collections to reset state between tests.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Disconnect Mongoose and stop the in-memory server.
 */
const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports = { connect, clearDatabase, disconnect };
