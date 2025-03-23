const { set, get, extendTTL } = require('../config/redis');
const { generateBase64Token, isValidUrl } = require('../utils');
const { create, findAll, findOne, updateOne, deleteOne } = require('../repositories/urlsRepository');

const ONE_MINUTE_IN_SECONDS = 60;

async function generateShortCode(length = 6, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const token = generateBase64Token(length);
    if (!(await findOne({ shortenUrlKey: token }))) {
      return token;
    }
    console.log(`Collision on ${token}, retrying (${i + 1}/${maxRetries})...`);
  }
  return generateBase64Token(length + 1);
}

async function getAllUrls() {
  return await findAll();
}

async function getUrlByShortenUrlKey(shortenUrlKey) {
  const cachedOriginalUrl = await get(shortenUrlKey);
  if (cachedOriginalUrl) {
    console.log(`[getUrlByShortenUrlKey] Cache hit: ${cachedOriginalUrl}`);
    await extendTTL(shortenUrlKey, ONE_MINUTE_IN_SECONDS);
    await updateOne({ shortenUrlKey }, { $inc: { visits: 1 } });
    return cachedOriginalUrl;
  }

  const savedUrl = await findOne({ shortenUrlKey });
  if (!savedUrl) throw new Error('Short URL not found');
  console.log(`[getUrlByShortenUrlKey] DB hit: ${savedUrl.originalUrl}`);
  await set(savedUrl.shortenUrlKey, savedUrl.originalUrl, 'EX', ONE_MINUTE_IN_SECONDS);
  await updateOne({ shortenUrlKey: savedUrl.shortenUrlKey }, { $inc: { visits: 1 } });
  return savedUrl.originalUrl;
}

async function getHitsByShortenUrlKey(shortenUrlKey) {
  const savedUrl = await findOne({ shortenUrlKey });
  if (!savedUrl) throw new Error('Short URL not found');
  return savedUrl.visits;
}

async function createShortenedUrl(originalUrl, customAlias) {
  if (!isValidUrl(originalUrl)) throw new Error('Invalid URL');

  const existingUrl = await findOne({ originalUrl });
  if (existingUrl && !customAlias) {
    return existingUrl.shortenUrlKey; // Reuse if no alias
  }

  let shortenUrlKey;
  if (customAlias) {
    if (await findOne({ shortenUrlKey: customAlias })) {
      throw new Error('Custom alias already taken');
    }
    shortenUrlKey = customAlias;
    if (existingUrl) {
      // Delete the old entry and its Redis cache
      await deleteOne({ shortenUrlKey: existingUrl.shortenUrlKey });
      await set(existingUrl.shortenUrlKey, '', 'EX', 1); // Expire old cache immediately
    }
  } else {
    shortenUrlKey = await generateShortCode();
  }

  const newUrl = await create({ originalUrl, shortenUrlKey });
  await set(newUrl.shortenUrlKey, newUrl.originalUrl, 'EX', ONE_MINUTE_IN_SECONDS);
  return newUrl.shortenUrlKey;
}

module.exports = { getAllUrls, getUrlByShortenUrlKey, getHitsByShortenUrlKey, createShortenedUrl };