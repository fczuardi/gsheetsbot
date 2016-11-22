const extend = require('xtend');
const Telegraf = require('telegraf');
const replies = require('../replies');
const tgs = require('telegraf-googlesheets');
const auth = require('../oauth');
const config = require('../config');
const emptyAnswersReply = require('./emptyAnswersReply');
const form = require('./schoolForm');
const sequenceReply = require('../sequenceReply');

const range = config.sheets.school.answers;
const valueInputOption = 'USER_ENTERED';
const insertDataOption = 'INSERT_ROWS';
const majorDimension = 'ROWS';

const spreadsheetId = tgs.getSheetId(config.sheets.url);
const params =
    { auth
    , spreadsheetId
    , range
    , valueInputOption
    , insertDataOption
    };

const writeFormRow = (ctx, next) => {
    console.log('---writeSchoolFormRow---', ctx.callbackQuery.id);
    const { schoolAnswers } = ctx.session;
    const resource =
        { majorDimension
        , values: [
            [ ...schoolAnswers
            , ctx.callbackQuery.message.date
            , ctx.session.currentFolder
            , ctx.callbackQuery.id
            , ctx.from.id
            ] ]
        , range
        };

    const menu = ctx.session.lastMenu;
    const submissionSentReplies = replies.school.submissionSent;
    const lastReply = !menu ? next : () => ctx.replyWithMarkdown(
        submissionSentReplies[submissionSentReplies.length - 1],
        { reply_markup: { keyboard: menu }, disable_web_page_preview: true }
    );

    return tgs.appendRow(
        extend(params, { resource })
    ).then(() => {
        ctx.state.submitError = false;
        ctx.session.schoolAnswers = [];
        return ctx.editMessageText(
            replies.school.submissionSent[0]
        ).then(() => sequenceReply(ctx,
            replies.school.submissionSent.slice(1, -1)
        )).then(lastReply);
    }).catch(err => {
        console.error(err);
        ctx.state.submitError = true;
        return ctx.editMessageText(
            replies.signup.submissionError
        ).then(next);
    });
};

const callbackEnd = (ctx, next) => {
    ctx.answerCallbackQuery().catch(err => console.error(err));
    return next();
};

const submitSchoolForm = Telegraf.branch(
    ctx => !ctx.session.schoolAnswers,
    Telegraf.compose(
        [ emptyAnswersReply
        , ...form
        ]
    ),
    writeFormRow
);

const action =
    [ submitSchoolForm
    , callbackEnd
    ];

module.exports = action;

