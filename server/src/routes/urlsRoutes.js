const { getAllUrls, getUrlByShortenUrlKey, getHitsByShortenUrlKey, createShortenedUrl } = require('../services/urlsService');

function urlsRoutes(app) {
  app.post('/api/shorten', async (req, res) => {
    try {
      const { originalUrl, alias } = req.body; // Alias from body
      const shortCode = await createShortenedUrl(originalUrl, alias);
      res.status(201).json(shortCode);
    } catch (error) {
      const status = error.message.includes('Invalid') ? 400 :
        error.message.includes('taken') ? 409 : 500;
      res.status(status).send(error.message);
    }
  });

  app.get('/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      console.log(`[GET /:shortCode] Requested: ${shortCode}`);
      const originalUrl = await getUrlByShortenUrlKey(shortCode);
      console.log(`[GET /:shortCode] Redirecting to: ${originalUrl}`);
      res.redirect(302, originalUrl);
    } catch (error) {
      console.error(`[GET /:shortCode] Error: ${error.message}`);
      res.status(404).send(error.message);
    }
  });

  app.get('/api/urls', async (req, res) => {
    try {
      const urls = await getAllUrls();
      res.status(200).json(urls);
    } catch (error) {
      res.status(500).send('Failed to retrieve URLs');
    }
  });

  app.get('/api/hits/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      const hits = await getHitsByShortenUrlKey(shortCode);
      res.status(200).json({ shortCode, hits });
    } catch (error) {
      res.status(404).send(error.message);
    }
  });
}

module.exports = urlsRoutes;