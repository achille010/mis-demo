const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:database');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI || (config.has('mongoURI') ? config.get('mongoURI') : 'mongodb://localhost:27017/mis-demo');

    // Modern Mongoose (8.x+) doesn't require these options and will warn if they are used
    await mongoose.connect(dbURI);
    debug(`MongoDB Connected: ${dbURI}`);
  } catch (error) {
    debug('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  debug('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  debug('MongoDB error:', error);
});

module.exports = connectDB;
