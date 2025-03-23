const { Schema, model } = require('mongoose');

const UrlSchema = new Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortenUrlKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  // expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) },
});

module.exports = model('url', UrlSchema);