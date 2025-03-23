const { createShortenedUrl, getAllUrls, getUrlByShortenUrlKey } = require('../services/urlsService');

async function getUrls(_request, reply) {
  try {
    const urls = await getAllUrls();
    return reply.code(302).send(urls);
  } catch (error) {
    return reply.code(500).send('Failed to retrieve the list of URLs');
  }
}

async function getUrl(request, reply) {
  try {
    const { shortenUrlKey } = request.params;
    const originalUrl = await getUrlByShortenUrlKey(shortenUrlKey);
    if (!originalUrl) {
      return reply.code(404).send('The requested shortened URL could not be found');
    }
    return reply.code(302).send(originalUrl);
  } catch (error) {
    return reply.code(500).send('Unable to retrieve the specified URL');
  }
}

async function postUrl(request, reply) {
  try {
    const { originalUrl } = request.body;
    const shortenUrlKey = await createShortenedUrl(originalUrl);
    if (!shortenUrlKey) {
      return reply.code(400).send('The provided URL is invalid');
    }
    return reply.code(201).send(shortenUrlKey);
  } catch (error) {
    return reply.code(500).send('Failed to create a shortened URL');
  }
}

module.exports = { getUrls, getUrl, postUrl };