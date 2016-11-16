const userStatusMiddleware = require('../middlewares/userStatus');
const config = require('../config');
const signupCommand = require('./signup');
const statusCommand = require('./status');
const filesCommand = require('./files');
const Telegraf = require('telegraf');

const newUser = Telegraf.compose(signupCommand);

const unapprovedUser = Telegraf.compose(statusCommand);

const menu = Telegraf.compose(filesCommand);

const start = Telegraf.branch(ctx => ctx.state.userHasApplied,
    Telegraf.branch(ctx => ctx.state.userIsApproved,
        menu,
        unapprovedUser
    ),
    newUser
);

const command =
    [ userStatusMiddleware
    , start
    ];

module.exports = command;

