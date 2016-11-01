const google = require('googleapis');
const extend = require('xtend');
require('toml-require').install();
const config = require('../../config.toml');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  config.oauth.redirectUrl
);

const setupState = (ctx, next) => {
    console.log('config middleware', ctx);
    const { message } = ctx.update;
    const admins = config.telegram.admins || [];
    console.log('admins', admins);
    if (!message) {
        return next();
    }
    const isAdmin = config.telegram.admins.includes(message.from.username);
    const loginUrl = oauth2Client.generateAuthUrl({
        scope: config.oauth.scopes
    });
    const nextState = extend(ctx.state,
        { isAdmin
        , loginUrl
        }
    );
    ctx.state = nextState; // eslint-disable-line
    return next();
};

module.exports = setupState;

