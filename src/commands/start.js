const loadSheetDataMiddleware = require('../middlewares/load');
const userStatus = require('../middlewares/userStatus');
const replies = require('../replies');

const welcome = (ctx, next) =>
    ctx.reply(replies.start.welcome(ctx.state.displayName))
    .then(next)
    .catch(err => console.error(err));

const start = (ctx, next) => {
    console.log('start command', ctx.state.userHasApplied);
    if (!ctx.state.userHasApplied) {
        return ctx.reply(replies.start.signup);
    }
    if (!ctx.state.userIsApproved) {
        return ctx.reply(`TBD (status): ${ctx.state.userStatus}`);
    }
    return next();
};

const menu = ctx => ctx.reply('TBD (menu)');

const command =
    [ welcome
    , loadSheetDataMiddleware
    , userStatus
    , start
    , menu
    ];

module.exports = command;

