const Telegraf = require('telegraf');
const tgs = require('telegraf-googlesheets');
const loadTable = require('../middlewares/load');
const config = require('../config');
const replies = require('../replies');
const emptyAnswersReply = require('./emptyAnswersReply');
const form = require('../actions/schoolForm');

const buttonColumns = 5;

const sheetName = tgs.getSheetName(config.sheets.school.questions);
const getQuestions = ctx => ctx.state.sheets[sheetName];

const loadQuestions = loadTable(config.sheets.school.questions);

const chooseAnswer = (ctx, next) => {
    console.log('--- reviewSchoolForm -- -');
    const questions = getQuestions(ctx);
    const answers = ctx.session.schoolAnswers || [];

    const lastLine = `\n${replies.signup.reviewQuestionsFooter}`;
    const replyText = questions.reduce((prev, questionRow, index) => {
        const line = `*${index + 1}. ${questionRow[1]}:* ${answers[index]}\n`;
        return index === questions.length - 1
            ? prev + line + lastLine
            : prev + line;
    }, '');
    const editAnswerButtons = answers.reduce((prev, answer, index) => {
        const button =
            { text: `${index + 1}`
            , callback_data: `editSchoolAnswer ${index}`
            };
        const row = Math.floor(index / buttonColumns);
        const oldRow = prev[row] || [];
        const newRow = oldRow.concat([ button ]);
        return prev.slice(0, row).concat([ newRow ]);
    }, []);
    const submitRow = [
        { text: replies.signup.submitButton
        , callback_data: 'submitSchoolForm'
        } ];
    console.log('ctx.updateType', ctx.updateType);
    ctx.session.questions = questions;
    ctx.session.awaitingInput = null;
    if (ctx.updateType === 'callback_query') {
        return ctx.editMessageText(replyText,
            { parse_mode: 'Markdown'
            , reply_markup: { inline_keyboard: editAnswerButtons.concat([ submitRow ]) }
            }
        ).then(next).catch(console.error);
    }
    return ctx.replyWithMarkdown(replyText, {
        reply_markup: { inline_keyboard: editAnswerButtons.concat([ submitRow ]) }
    }).then(next).catch(console.error);
};

const reviewSchoolForm = Telegraf.branch(
    ctx => !ctx.session.schoolAnswers,
    Telegraf.compose(
        [ emptyAnswersReply
        , ...form
        ]
    ),
    Telegraf.compose(
        [ loadQuestions
        , chooseAnswer
        ]
    )
);

const callbackEnd = (ctx, next) => {
    if (ctx.updateType !== 'callback_query') {
        return next();
    }
    ctx.answerCallbackQuery().catch(err => console.error(err));
    return next();
};

const actions =
    [ reviewSchoolForm
    , callbackEnd
    ];

module.exports = actions;
