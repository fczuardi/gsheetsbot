const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const config = require('../config');
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
    , loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    , start
    , menu
    ];

module.exports = command;

