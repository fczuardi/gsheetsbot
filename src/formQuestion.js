const extend = require('xtend');
const Handlebars = require('handlebars');

const firstName = name => (name ? name.split(' ')[0] : '');
Handlebars.registerHelper('firstName', firstName);

const makeKeyboard = (currentQuestion, callbackData, isInline) => {
    const questionOptionsString = currentQuestion[3] || '';
    if (!isInline) {
        const specialButtonTypes =
            [ 'request_location'
            , 'request_contact'
            ];
        if (specialButtonTypes.includes(questionOptionsString)) {
            return [ { text: currentQuestion[1], [questionOptionsString]: true } ];
        }
    }
    const questionOptions = questionOptionsString.indexOf('|') !== -1
        ? questionOptionsString.split('|')
        : [];
    return questionOptions.map(text => {
        const cbd = callbackData
            ? { callback_data: `${callbackData} ${text}` }
            : {};
        return extend({ text }, cbd);
    });
};

const makeQuestion = (ctx, questions, answers) => {
    const currentQuestion = questions[answers.length];
    const template = Handlebars.compile(currentQuestion[2]);
    const answersObj = answers.reduce((prev, answer, index) =>
        extend(prev, { [questions[index][0]]: answer })
    , {});
    const keyboard = makeKeyboard(currentQuestion);
    const replyMarkup =
        { keyboard: [ keyboard ]
        };
    const options = { reply_markup: replyMarkup };
    const removeKeyboard = { reply_markup: { remove_keyboard: true } };
    const replyKeyboard = keyboard.length ? options : removeKeyboard;
    return ctx.replyWithMarkdown(template(answersObj), replyKeyboard);
};

const makeEditAnswerQuestion = (ctx, currentQuestion, callbackData) => {
    const keyboard = makeKeyboard(currentQuestion, callbackData, true);
    const replyMarkup =
        { inline_keyboard: [ keyboard ]
        };
    const parseMode = { parse_mode: 'Markdown' };
    const options = keyboard.length
        ? extend(parseMode, { reply_markup: replyMarkup })
        : parseMode;
    return ctx.editMessageText(
        `Ok, digite a novamente:\n*${currentQuestion[1]}*`,
        options
    );
};

const makeEditAnswerAction = (callbackData, awaitingInput) => (ctx, next) => {
    const answerIndex = parseInt(ctx.match[2], 10);
    if (!ctx.session.questions || !ctx.session.questions[answerIndex]) {
        console.error('session questions lost');
        return next();
    }
    const currentQuestion = ctx.session.questions[answerIndex];
    ctx.session.answerToEdit = answerIndex;
    ctx.session.awaitingInput = awaitingInput;
    return makeEditAnswerQuestion(ctx, currentQuestion, callbackData)
        .then(next).catch(console.error);
};

const lib =
    { makeQuestion
    , makeEditAnswerQuestion
    , makeEditAnswerAction
    };

module.exports = lib;

