const extend = require('xtend');
const Handlebars = require('handlebars');

const firstName = name => (name ? name.split(' ')[0] : '');
Handlebars.registerHelper('firstName', firstName);

const makeKeyboard = (currentQuestion, callbackData) => {
    const questionOptionsString = currentQuestion[3] || '';
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
    console.log('makeQuestion');
    console.log({ answers });
    const currentQuestion = questions[answers.length];
    const template = Handlebars.compile(currentQuestion[2]);
    const answersObj = answers.reduce((prev, answer, index) =>
        extend(prev, { [questions[index][0]]: answer })
    , {});
    const keyboard = makeKeyboard(currentQuestion);
    const replyMarkup =
        { keyboard: [ keyboard ]
        , one_time_keyboard: true
        };
    const options = { reply_markup: replyMarkup };
    const replyKeyboard = keyboard.length ? options : null;
    return ctx.replyWithMarkdown(template(answersObj), replyKeyboard);
};

const makeEditAnswerQuestion = (ctx, currentQuestion, callbackData) => {
    const keyboard = makeKeyboard(currentQuestion, callbackData);
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

const lib =
    { makeQuestion
    , makeEditAnswerQuestion
    };

module.exports = lib;

