const extend = require('xtend');
const Handlebars = require('handlebars');
const tgs = require('telegraf-googlesheets');
const config = require('../config');
const loadTable = require('../middlewares/load');
const addUserStatus = require('../middlewares/userStatus');

const loadQuestions = loadTable(config.sheets.user.questions);
const loadUserStatus = loadTable(config.sheets.user.status);

const firstName = name => (name ? name.split(' ')[0] : '');

Handlebars.registerHelper('firstName', firstName);

const signup = (ctx, next) => {
    console.log('ctx.state.sheets', ctx.state.sheets);
    const userAnswers = ctx.session.answers || [];
    const sheetName = tgs.getSheetName(config.sheets.user.questions);
    const questions = ctx.state.sheets[sheetName];
    const currentQuestion = userAnswers.length;
    if (currentQuestion === questions.length) {
        ctx.session.awaitingInput = null; // eslint-disable-line
        return ctx.reply('TBD form completed');
    }
    const template = Handlebars.compile(questions[userAnswers.length][2]);
    const answersObj = userAnswers.reduce((prev, answer, index) => {
        const varName = questions[index][0];
        return extend(prev, { [varName]: answer });
    }, {});
    ctx.session.awaitingInput = 'signup'; // eslint-disable-line
    ctx.session.answers = userAnswers; // eslint-disable-line
    ctx.replyWithMarkdown(template(answersObj));
    return next();
};

const command =
    [ loadQuestions
    , loadUserStatus
    , addUserStatus
    , signup
    ];

module.exports = command;

