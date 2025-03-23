const Redis = require('ioredis');

let client;

function getRedisClient() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || {
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USER || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    });
    client.on('error', (error) => console.error('Redis Client Error:', error.message));
  }
  return client;
}

async function connectToRedis() {
  const client = getRedisClient();
  client.on('connect', () => console.log('Successfully connected to Redis'));
  client.on('error', (error) => console.error('Error on Redis:', error.message));
}

async function set(key, value, expirationMode, seconds) {
  try {
    await getRedisClient().set(key, value, expirationMode, seconds);
    console.info(`Key ${key} created in Redis cache`);
  } catch (error) {
    console.error(`Failed to create key in Redis cache: ${error}`);
  }
}

async function get(key) {
  try {
    const value = await getRedisClient().get(key);
    console.info(`Value with key ${key} retrieved from Redis cache`);
    return value;
  } catch (error) {
    console.error(`Failed to retrieve value with key ${key}: ${error}`);
    return null;
  }
}

async function extendTTL(key, additionalTimeInSeconds) {
  try {
    const currentTTL = await getRedisClient().ttl(key);
    if (currentTTL > 0) {
      const newTTL = currentTTL + additionalTimeInSeconds;
      await getRedisClient().expire(key, newTTL);
      console.info(`TTL for key ${key} extended to ${newTTL}`);
    } else {
      console.error(`Failed to extend TTL of key ${key}`);
    }
  } catch (error) {
    console.error(`Error extending TTL for key ${key}: ${error}`);
  }
}

module.exports = { connectToRedis, set, get, extendTTL };