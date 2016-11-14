const Telegraf = require('telegraf');
const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const signupCommand = require('./signup');
const config = require('../config');
const replies = require('../replies');

const status = (ctx, next) => {
    console.log('status command', ctx.state.userHasApplied);
    if (!ctx.state.userIsApproved) {
        if (ctx.state.userStatus === config.sheets.user.deniedValue) {
            return ctx.reply(
                replies.status.unapproved(ctx.state.statusNote)
            ).then(next);
        }
        return ctx.reply(replies.status.pending).then(next);
    }
    return ctx.reply(replies.status.approved).then(next);
};

const statusOrSignup = Telegraf.branch(ctx => ctx.state.userHasApplied,
    status,
    Telegraf.compose(signupCommand)
);

const command =
    [ loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    , statusOrSignup
    ];

module.exports = command;

