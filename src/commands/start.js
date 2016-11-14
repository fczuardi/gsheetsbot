const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const config = require('../config');
const replies = require('../replies');
const signupCommand = require('./signup');
const statusCommand = require('./status');
const Telegraf = require('telegraf');

const welcome = (ctx, next) =>
    ctx.reply(replies.start.welcome(ctx.state.displayName))
    .then(next)
    .catch(err => console.error(err));

const newUser = Telegraf.compose(signupCommand);

const unapprovedUser = Telegraf.compose(statusCommand);

const menu = (ctx, next) =>
    ctx.reply('TBD (menu)').then(next);

const start = Telegraf.branch(ctx => ctx.state.userHasApplied,
    Telegraf.branch(ctx => ctx.state.userIsApproved,
        menu,
        unapprovedUser
    ),
    newUser
);

const command =
    [ welcome
    , loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    , start
    ];

module.exports = command;

