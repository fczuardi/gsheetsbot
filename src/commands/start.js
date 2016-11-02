const loadSheetDataMiddleware = require('../middlewares/load');
const replies = require('../replies');

const welcome = (ctx, next) =>
    ctx.reply(replies.start.welcome(ctx.state.displayName))
    .then(next);

const start = ctx => {
    if (!ctx.state.hasApplied) {
        return ctx.reply(replies.start.signup);
    }
    if (!ctx.state.isApproved) {
        return ctx.reply('your status is:', ctx.state.userStatus);
    }
    return null;
};

const command =
    [ welcome
    , loadSheetDataMiddleware
    , start
    ];

module.exports = command;

