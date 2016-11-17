const Telegraf = require('telegraf');
const tgs = require('telegraf-googlesheets');
const replies = require('../replies');
const config = require('../config');
const { makeQuestion } = require('../formQuestion.js');

// middlewares
const loadTable = require('../middlewares/load');
const loadQuestions = loadTable(config.sheets.user.questions);

// helpers
const sheetName = tgs.getSheetName(config.sheets.user.questions);
const getQuestions = ctx => ctx.state.sheets[sheetName];
const getAnswers = ctx => ctx.session.answers || [];
const isLastAnswer = ctx => getAnswers(ctx).length === getQuestions(ctx).length;

const nextQuestion = ctx => {
    const questions = getQuestions(ctx);
    const userAnswers = getAnswers(ctx);
    console.log({ userAnswers });
    ctx.session.awaitingInput = 'signup';
    ctx.session.answers = userAnswers;
    if (userAnswers.length === 0) {
        return ctx.replyWithMarkdown(replies.signup.formStart)
            .then(() => makeQuestion(ctx, questions, userAnswers))
            .catch(console.error);
    }
    return makeQuestion(ctx, questions, userAnswers).catch(console.error);
};

const signupEnd = (ctx, next) => {
    const inlineKeyboard = [ [
        { text: replies.signup.submitButton
        , callback_data: 'submitUserForm'
        },
        { text: replies.signup.reviewButton
        , callback_data: 'reviewUserForm'
        }
    ] ];
    const replyOptions = { reply_markup: { inline_keyboard: inlineKeyboard } };
    const replyText = ctx.state.submitError
        ? replies.signup.retryFormFinished
        : replies.signup.formFinished;
    ctx.session.awaitingInput = null;
    return ctx.replyWithMarkdown(
        replyText, replyOptions
    ).then(next).catch(console.error);
};

const command =
    [ loadQuestions
    , Telegraf.branch(isLastAnswer, signupEnd, nextQuestion)
    ];

module.exports = command;

