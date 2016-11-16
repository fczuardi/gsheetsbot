const Telegraf = require('telegraf');
const extend = require('xtend');
const Handlebars = require('handlebars');
const tgs = require('telegraf-googlesheets');
const replies = require('../replies');
const config = require('../config');

// middlewares
const addUserStatus = require('../middlewares/userStatus');
const loadTable = require('../middlewares/load');
const loadQuestions = loadTable(config.sheets.user.questions);
const loadUserStatus = loadTable(config.sheets.user.status);

// helpers
const sheetName = tgs.getSheetName(config.sheets.user.questions);
const getQuestions = ctx => ctx.state.sheets[sheetName];
const getAnswers = ctx => ctx.session.answers || [];
const isLastAnswer = ctx => getAnswers(ctx).length === getQuestions(ctx).length;
const firstName = name => (name ? name.split(' ')[0] : '');
Handlebars.registerHelper('firstName', firstName);

const nextQuestion = ctx => {
    const questions = getQuestions(ctx);
    const userAnswers = getAnswers(ctx);
    const template = Handlebars.compile(questions[userAnswers.length][2]);
    const answersObj = userAnswers.reduce((prev, answer, index) => {
        const varName = questions[index][0];
        return extend(prev, { [varName]: answer });
    }, {});
    ctx.session.awaitingInput = 'signup';
    ctx.session.answers = userAnswers;
    const makeQuestion = () => ctx.replyWithMarkdown(
        template(answersObj)
    ).catch(console.error);
    if (userAnswers.length === 0) {
        return ctx.replyWithMarkdown(replies.signup.formStart).then(makeQuestion);
    }
    return makeQuestion();
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
    , loadUserStatus
    , addUserStatus
    , Telegraf.branch(isLastAnswer, signupEnd, nextQuestion)
    ];

module.exports = command;

