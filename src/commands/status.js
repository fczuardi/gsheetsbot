const Telegraf = require('telegraf');
const tgs = require('telegraf-googlesheets');
const loadSheet = require('../middlewares/load');
const schoolStatusMiddleware = require('../middlewares/schoolStatus');
const signupCommand = require('./signup');
const config = require('../config');
const replies = require('../replies');
const sequenceReply = require('../sequenceReply');
const { updateRows } = require('../cron');

// write "Yes" on the notification column to prevent
// cron sending this same message again
const flagUserAsNotified = ctx => {
    const userId = `${ctx.from.id}`;
    const sheetName = tgs.getSheetName(config.sheets.user.status);
    const sheetData = ctx.state.sheets[sheetName] || [];
    // console.log({ sheetData });
    const { statusUserId
        , statusColumn
        , approvedValue
        , deniedValue
        , statusNotificationColumn
        , notifiedValue
    } = config.sheets.user;
    let changed = false;
    const newRows = sheetData.map(row => {
        if (
            row[statusUserId] !== userId ||
            (row[statusColumn] !== approvedValue && row[statusColumn] !== deniedValue) ||
            row[statusNotificationColumn] === notifiedValue
        ) {
            return row;
        }
        row[statusNotificationColumn] = notifiedValue;
        changed = true;
        // console.log({ row });
        return Array.apply(null, row).map(c => (c === undefined ? '' : c));
    });
    // console.log({ newRows });
    if (changed) {
        return updateRows(newRows);
    }
    return 'notified';
};

const userStatus = (ctx, next) => {
    if (ctx.state.userStatus === config.sheets.user.deniedValue) {
        flagUserAsNotified(ctx);
        const removeKeyboard = { reply_markup: { remove_keyboard: true } };
        return ctx.replyWithMarkdown(
            replies.status.unapproved(ctx.state.statusNote), removeKeyboard
        ).then(next);
    }
    return ctx.replyWithMarkdown(replies.status.pending).then(next);
};

const schoolStatus = (ctx, next) => {
    if (!ctx.state.userHasAppliedSchools) {
        console.log('user havent applied any school');
        if(flagUserAsNotified(ctx) !== 'notified') {
            return ctx.replyWithMarkdown(replies.status.approved).then(next);
        }
        return ctx.replyWithMarkdown(replies.school.noSubmission).then(next);
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
    [ statusOrSignup
    ];

module.exports = command;

