const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:database');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI || (config.has('mongodb.uri') ? config.get('mongodb.uri') : 'mongodb://localhost:27017/school-mis');
    const options = config.has('mongodb.options') ? config.get('mongodb.options') : {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    
    await mongoose.connect(dbURI, options);
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

