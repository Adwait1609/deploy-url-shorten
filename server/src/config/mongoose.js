const { connect } = require('mongoose');

async function connectToMongoDB() {
  try {
    // Use individual variables provided by Railway
    const {
      MONGO_HOST = 'mongo',           // Default for local
      MONGO_PORT = '27017',
      MONGO_USER = 'user',
      MONGO_PASSWORD = 'pass',
      MONGO_DATABASE = 'urls'
    } = process.env;

    const MONGO_URI = process.env.DATABASE_URL ||
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`;

    await connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToMongoDB };