const google = require('googleapis');

require('toml-require').install();
const config = require('../config.toml');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  config.oauth.redirectUrl
);

module.exports = oauth2Client;

