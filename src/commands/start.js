const loadSheetDataMiddleware = require('../middlewares/load');
const replies = require('../replies');
const start = ctx => {
    ctx.reply(replies.start.welcome(ctx.state.displayName)).then(() =>
    ctx.reply(replies.start.signup));
};

module.exports = [loadSheetDataMiddleware, start];

