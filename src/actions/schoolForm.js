const Telegraf = require('telegraf');
const tgs = require('telegraf-googlesheets');
const config = require('../config');
const replies = require('../replies');
const loadTable = require('../middlewares/load');
const statusCommand = require('../commands/status');
const { makeQuestion } = require('../formQuestion.js');

const questionsRange = config.sheets.school.questions;
const sheetName = tgs.getSheetName(questionsRange);
const getQuestions = ctx => ctx.state.sheets[sheetName];
const getAnswers = ctx => ctx.session.schoolAnswers || [];

const answerCallback = (ctx, next) => (ctx.updateType === 'callback_query'
    ? ctx.answerCallbackQuery().then(next).catch(console.error)
    : next()
);

const nextSchoolQuestion = ctx => {
    // console.log('- - - schoolForm - - - -');
    const questions = getQuestions(ctx);
    const answers = getAnswers(ctx);
    ctx.session.awaitingInput = 'schoolForm';
    ctx.session.schoolAnswers = answers;
    return makeQuestion(ctx, questions, answers).catch(console.error);
};

const formEnd = (ctx, next) => {
    const inlineKeyboard = [ [
        { text: replies.signup.submitButton
        , callback_data: 'submitSchoolForm'
        },
        { text: replies.signup.reviewButton
        , callback_data: 'reviewSchoolForm'
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

const isLastAnswer = ctx => getAnswers(ctx).length === getQuestions(ctx).length;

const unapprovedUser = Telegraf.compose(statusCommand);

const approvedUser = Telegraf.compose(
    [ loadTable(questionsRange)
    , Telegraf.branch(isLastAnswer, formEnd, nextSchoolQuestion)
    ]);

const action =
    [ answerCallback
    , Telegraf.branch(ctx => ctx.state.userIsApproved, approvedUser, unapprovedUser)
    ];

module.exports = action;

