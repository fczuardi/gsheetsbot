const tgs = require('telegraf-googlesheets');
const config = require('../config');
const loadTable = require('../middlewares/load');
const addUserStatus = require('../middlewares/userStatus');

const loadQuestions = loadTable(config.sheets.user.questions);
const loadUserStatus = loadTable(config.sheets.user.status);

const signup = (ctx, next) => {
    console.log('ctx.state.sheets', ctx.state.sheets);
    console.log(ctx.session);
    const userAnswers = ctx.session.answers || [];
    const sheetName = tgs.getSheetName(config.sheets.user.questions);
    const questions = ctx.state.sheets[sheetName];
    const currentQuestion = userAnswers.length;
    if (currentQuestion === questions.length) {
        ctx.session.awaitingInput = null; // eslint-disable-line
        return ctx.reply('TBD form completed');
    }
    ctx.session.awaitingInput = 'signup'; // eslint-disable-line 
    ctx.session.answers = userAnswers; // eslint-disable-line
    ctx.replyWithMarkdown(questions[userAnswers.length][2]);
    return next();
};

const command =
    [ loadQuestions
    , loadUserStatus
    , addUserStatus
    , signup
    ];

module.exports = command;

