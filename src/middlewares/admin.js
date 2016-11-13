const extend = require('xtend');
const config = require('../config');
const oauth2Client = require('../oauth');

const setupState = (ctx, next) => {
    const { message } = ctx.update;
    const admins = config.telegram.admins || [];
    if (!message) {
        return next();
    }
    const isAdmin = admins.includes(message.from.username);
    const loginUrl = oauth2Client.generateAuthUrl(
        { access_type: 'offline'
        , prompt: 'consent'
        , scope: config.oauth.scopes
        }
    );
    const nextState = extend(ctx.state,
        { isAdmin
        , loginUrl
        }
    );
    ctx.state = nextState;
    return next();
};

module.exports = setupState;

