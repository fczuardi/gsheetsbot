const Telegraf = require('telegraf');
const loadSheet = require('../middlewares/load');
const userStatusMiddleware = require('../middlewares/userStatus');
const schoolStatusMiddleware = require('../middlewares/schoolStatus');
const signupCommand = require('./signup');
const config = require('../config');
const replies = require('../replies');
const sequenceReply = require('../sequenceReply');

const userStatus = (ctx, next) => {
    if (ctx.state.userStatus === config.sheets.user.deniedValue) {
        return ctx.replyWithMarkdown(
            replies.status.unapproved(ctx.state.statusNote)
        ).then(next);
    }
    return ctx.replyWithMarkdown(replies.status.pending).then(next);
};

const schoolStatus = (ctx, next) => {
    if (!ctx.state.userHasAppliedSchools) {
        return ctx.replyWithMarkdown(replies.status.approved).then(next);
    }
    const schoolListMarkdown = ctx.state.schoolStatusList.map(
        replies.school.statusLine
    );
    return sequenceReply(ctx, schoolListMarkdown).then(next);
};

const userOrSchoolStatus = Telegraf.branch(ctx => ctx.state.userIsApproved
    , Telegraf.compose(
        [ loadSheet(config.sheets.school.status)
        , schoolStatusMiddleware
        , schoolStatus ])
    , userStatus
);

const statusOrSignup = Telegraf.branch(ctx => ctx.state.userHasApplied,
    userOrSchoolStatus,
    Telegraf.compose(signupCommand)
);

const command =
    [ userStatusMiddleware
    , statusOrSignup
    ];

module.exports = command;

