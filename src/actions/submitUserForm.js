const Telegraf = require('telegraf');
const replies = require('../replies');
const tgs = require('telegraf-googlesheets');
// const oauth2Client = require('../oauth');
// const config = require('../config');
const signup = require('../commands/signup');

const submitUserForm = (ctx, next) => {
    // console.log('---submitUserForm---', ctx.callbackQuery.id);
    const { answers } = ctx.session;
    if (!answers) {
        return ctx.editMessageText(
            replies.signup.emptyAnswersError
        ).then(next).catch(err => {
            console.error(err);
            return next();
        });
    }
    return tgs.appendRow(
        { foo: 'bar' }
    ).then(() => {
        ctx.state.submitError = false; // eslint-disable-line
        return ctx.editMessageText(
            replies.signup.submissionSent
        ).then(next);
    }).catch(err => {
        console.error(err);
        ctx.state.submitError = true; // eslint-disable-line
        return ctx.editMessageText(
            replies.signup.submissionError
        ).then(next);
    });
};

const callbackEnd = (ctx, next) => {
    ctx.answerCallbackQuery().catch(err => console.error(err));
    return next();
};

const restartSignupIfNeeded = Telegraf.branch(
    ctx => !ctx.session.answers || ctx.state.submitError,
    Telegraf.compose(signup),
    ctx => console.log('form submitted.', ctx.session, ctx.state)
);

const action =
    [ submitUserForm
    , callbackEnd
    , restartSignupIfNeeded
    ];

module.exports = action;

