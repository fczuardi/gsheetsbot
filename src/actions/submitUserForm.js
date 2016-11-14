const extend = require('xtend');
const Telegraf = require('telegraf');
const replies = require('../replies');
const tgs = require('telegraf-googlesheets');
const auth = require('../oauth');
const config = require('../config');
const emptyAnswersReply = require('./emptyAnswersReply');
const signup = require('../commands/signup');

const range = config.sheets.user.answers;
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
    console.log('---writeFormRow---', ctx.callbackQuery.id);
    const { answers } = ctx.session;
    const resource =
        { majorDimension
        , values: [
            [ ...answers
            , ctx.callbackQuery.message.date
            , JSON.stringify(ctx.from)
            , ctx.from.id
            ] ]
        , range
        };
    return tgs.appendRow(
        extend(params, { resource })
    ).then(() => {
        ctx.state.submitError = false;
        return ctx.editMessageText(
            replies.signup.submissionSent
        ).then(next);
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

const submitUserForm = Telegraf.branch(
    ctx => !ctx.session.answers,
    Telegraf.compose(
        [ emptyAnswersReply
        , ...signup
        ]
    ),
    writeFormRow
);

const action =
    [ submitUserForm
    , callbackEnd
    ];

module.exports = action;

