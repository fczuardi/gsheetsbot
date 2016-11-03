const google = require('googleapis');

const config = require('./config');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  config.oauth.redirectUrl
);

oauth2Client.setCredentials(
    { refresh_token: config.oauth.refreshToken
    , expiry_date: true
    }
);

module.exports = oauth2Client;

