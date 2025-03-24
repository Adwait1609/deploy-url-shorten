const Redis = require('ioredis');

let client;

function getRedisClient() {
  if (!client) {
    const redisConfig = {
      host: process.env.REDISHOST || 'redis',              // Railway's REDIS_HOST
      port: Number(process.env.REDISPORT) || 6379,         // Railway's REDIS_PORT
      username: process.env.REDISUSER || undefined,        // Railway's REDIS_USER
      password: process.env.REDISPASSWORD || undefined,    // Railway's REDIS_PASSWORD
      maxRetriesPerRequest: null,
      family: 0,                                            // Force IPv6 + IPv4 lookup
    };
    console.log('Using Redis Config:', redisConfig);  // Debug line
    client = new Redis(redisConfig);
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