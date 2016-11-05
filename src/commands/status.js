const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const config = require('../config');
const replies = require('../replies');

const status = (ctx, next) => {
    console.log('status command', ctx.state.userHasApplied);
    if (!ctx.state.userHasApplied) {
        return ctx.reply(replies.status.signup);
    }
    if (!ctx.state.userIsApproved) {
        return ctx.reply(`TBD (status): ${ctx.state.userStatus}`);
    }
    ctx.reply(replies.status.approved);
    return next();
};

const command =
    [ loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    , status
    ];

module.exports = command;

