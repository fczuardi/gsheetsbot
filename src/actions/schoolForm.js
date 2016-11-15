const Telegraf = require('telegraf');
const Handlebars = require('handlebars');
const extend = require('xtend');
const tgs = require('telegraf-googlesheets');
const config = require('../config');
const replies = require('../replies');
const loadTable = require('../middlewares/load');

const questionsRange = config.sheets.school.questions;
const sheetName = tgs.getSheetName(questionsRange);
const getQuestions = ctx => ctx.state.sheets[sheetName];
const getAnswers = ctx => ctx.session.schoolAnswers || [];

const answerCallback = (ctx, next) => (ctx.updateType === 'callback_query'
    ? ctx.answerCallbackQuery().then(next).catch(console.error)
    : next()
);

const nextSchoolQuestion = (ctx, next) => {
    console.log('- - - schoolForm - - - -');
    const questions = getQuestions(ctx);
    const answers = getAnswers(ctx);
    const currentQuestion = questions[answers.length];
    const questionOptionsString = currentQuestion[3] || '';
    const questionOptions = questionOptionsString.indexOf('|') !== -1
        ? questionOptionsString.split('|')
        : [];
    const template = Handlebars.compile(currentQuestion[2]);
    const answersObj = answers.reduce((prev, answer, index) =>
        extend(prev, { [questions[index][0]]: answer })
    , {});
    console.log('questionOptionsString', questionOptionsString, questionOptions);
    const makeQuestion = () => {
        const keyboard = questionOptions.map(text => ({ text }));
        const replyMarkup =
            { keyboard: [ keyboard ]
            , one_time_keyboard: true
            };
        const options = { reply_markup: replyMarkup };
        const replyKeyboard = keyboard.length ? options : null;
        return ctx.replyWithMarkdown(template(answersObj), replyKeyboard);
    };
    ctx.session.awaitingInput = 'schoolForm';
    ctx.session.schoolAnswers = answers;
    return makeQuestion().then(next).catch(console.error);
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
    return ctx.reply(
        replyText, replyOptions
    ).then(next).catch(console.error);
};

const isLastAnswer = ctx => getAnswers(ctx).length === getQuestions(ctx).length;

const action =
    [ answerCallback
    , loadTable(questionsRange)
    , Telegraf.branch(isLastAnswer, formEnd, nextSchoolQuestion)
    ];

module.exports = action;

