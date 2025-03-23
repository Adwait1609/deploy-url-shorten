require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./config/mongoose');
const { connectToRedis } = require('./config/redis');
const urlsRoutes = require('./routes/urlsRoutes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

urlsRoutes(app);

async function start() {
  try {
    await connectToMongoDB();
    await connectToRedis();
    app.listen(process.env.NODE_SERVER_LOCAL_PORT || 3000, process.env.NODE_SERVER_HOST || '0.0.0.0', () => {
      console.log('Server is now listening on port', process.env.NODE_SERVER_LOCAL_PORT || 3000);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();