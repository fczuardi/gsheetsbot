const Telegraf = require('telegraf');
const extend = require('xtend');
const Handlebars = require('handlebars');
const tgs = require('telegraf-googlesheets');
const replies = require('../replies');
const config = require('../config');
const loadTable = require('../middlewares/load');
const addUserStatus = require('../middlewares/userStatus');

const loadQuestions = loadTable(config.sheets.user.questions);
const loadUserStatus = loadTable(config.sheets.user.status);


const sheetName = tgs.getSheetName(config.sheets.user.questions);
const getQuestions = ctx => ctx.state.sheets[sheetName];
const getAnswers = ctx => ctx.session.answers || [];

const isLastAnswer = ctx => getAnswers(ctx).length === getQuestions(ctx).length;

const firstName = name => (name ? name.split(' ')[0] : '');
Handlebars.registerHelper('firstName', firstName);

const nextQuestion = (ctx, next) => {
    console.log('ctx.state.sheets', ctx.state.sheets);
    const questions = getQuestions(ctx);
    const userAnswers = getAnswers(ctx);
    const template = Handlebars.compile(questions[userAnswers.length][2]);
    const answersObj = userAnswers.reduce((prev, answer, index) => {
        const varName = questions[index][0];
        return extend(prev, { [varName]: answer });
    }, {});
    ctx.session.awaitingInput = 'signup'; // eslint-disable-line
    ctx.session.answers = userAnswers; // eslint-disable-line
    return ctx.replyWithMarkdown(
        template(answersObj)
    ).then(next).catch(console.error);
};

const signupEnd = (ctx, next) => {
    console.log('signupEnd', next);
    ctx.session.awaitingInput = null; // eslint-disable-line
    const inlineKeyboard = [ [
        { text: replies.signup.submitButton
        , callback_data: 'submitUserForm'
        },
        { text: replies.signup.reviewButton
        , callback_data: 'reviewUserForm'
        }
    ] ];
    const replyOptions = { reply_markup: { inline_keyboard: inlineKeyboard } };
    return ctx.reply(
        replies.signup.formFinished, replyOptions
    ).then(next).catch(console.error);
};

const command =
    [ loadQuestions
    , loadUserStatus
    , addUserStatus
    , Telegraf.branch(isLastAnswer, signupEnd, nextQuestion)
    ];

module.exports = command;

