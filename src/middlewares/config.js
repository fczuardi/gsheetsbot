const extend = require('xtend');
require('toml-require').install();
const config = require('../../config.toml');


const setupState = (ctx, next) => {
    console.log('config middleware', ctx);
    const { message } = ctx.update;
    const admins = config.telegram.admins || [];
    console.log('admins', admins);
    if (!message) {
        return next();
    }
    const isAdmin = config.telegram.admins.includes(message.from.username);
    const nextState = extend(ctx.state, { isAdmin });
    ctx.state = nextState;
    return next(extend(ctx, { state: nextState }));
};

module.exports = setupState;

