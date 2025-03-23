const { connect } = require('mongoose');

async function connectToMongoDB() {
  try {
    // Use MONGO_URL directly if provided (Railway), fallback to local config
    const MONGO_URI = process.env.MONGO_URL ||
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

    await connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToMongoDB };