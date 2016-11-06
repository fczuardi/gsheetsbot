const Telegraf = require('telegraf');
const replies = require('../replies');
const signup = require('../commands/signup');
const submitUserForm = (ctx, next) => {
    // console.log('---submitUserForm---', ctx.callbackQuery.id);
    const { answers } = ctx.session;
    if (!answers) {
        return ctx.editMessageText(
            replies.signup.submissionError
        ).then(next).catch(err => {
            console.error(err);
            return next();
        });
    }
    console.log('TBD send the answers', ctx.session.answers);
    return ctx.editMessageText(
        replies.signup.submissionSent
    ).then(next);
};

const callbackEnd = (ctx, next) => {
    ctx.answerCallbackQuery().catch(err => console.error(err));
    return next();
};

const restartSignupIfNeeded = Telegraf.branch(
    ctx => !ctx.session.answers, Telegraf.compose(signup),
    () => null
);

const action =
    [ submitUserForm
    , callbackEnd
    , restartSignupIfNeeded
    ];

module.exports = action;

