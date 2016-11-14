const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const config = require('../config');
const replies = require('../replies');
const signupCommand = require('./signup');
const statusCommand = require('./status');
const Telegraf = require('telegraf');

const newUser = Telegraf.compose(signupCommand);

const unapprovedUser = Telegraf.compose(statusCommand);

const menu = (ctx, next) => {
    console.log('menu -- --');
    return ctx.reply('TBD (menu)').then(next);
};

const start = Telegraf.branch(ctx => ctx.state.userHasApplied,
    Telegraf.branch(ctx => ctx.state.userIsApproved,
        menu,
        unapprovedUser
    ),
    newUser
);

const command =
    [ loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    , start
    ];

module.exports = command;

