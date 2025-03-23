const { randomBytes } = require('crypto');

function generateBase64Token(length) {
  const buffer = randomBytes(Math.ceil((length * 3) / 4));
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
    .slice(0, length);
}

function isValidUrl(value) {
  const pattern = new RegExp(
    '^https?:\\/\\/' +
    '(?:www\\.)?' +
    '[-a-zA-Z0-9@:%._\\+~#=]{1,256}' +
    '\\.[a-zA-Z0-9()]{1,6}\\b' +
    '(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$',
    'i'
  );
  return pattern.test(value);
}

module.exports = { generateBase64Token, isValidUrl };