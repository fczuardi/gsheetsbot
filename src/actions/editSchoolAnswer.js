const extend = require('xtend');

const answerCallback = (ctx, next) => (ctx.updateType === 'callback_query'
    ? ctx.answerCallbackQuery().then(next).catch(console.error)
    : next()
);

const editAnswer = (ctx, next) => {
    const answerIndex = parseInt(ctx.match[2], 10);
    if (!ctx.session.questions || !ctx.session.questions[answerIndex]) {
        console.error('session questions lost');
        return next();
    }
    const currentQuestion = ctx.session.questions[answerIndex];
    const questionOptionsString = currentQuestion[3] || '';
    const questionOptions = questionOptionsString.indexOf('|') !== -1
        ? questionOptionsString.split('|')
        : [];
    const keyboard = questionOptions.map(text => (
        { text
        , callback_data: `changeSchoolAnswer ${text}`
        }
    ));
    const replyMarkup =
        { inline_keyboard: [ keyboard ]
        };
    const parseMode = { parse_mode: 'Markdown' };
    const options = keyboard.length
        ? extend(parseMode, { reply_markup: replyMarkup })
        : parseMode;
    ctx.session.answerToEdit = answerIndex;
    ctx.session.awaitingInput = 'editSchoolAnswer';
    console.log('edit school answer Options', JSON.stringify(options));
    return ctx.editMessageText(
        `Ok, digite a novamente:\n*${currentQuestion[1]}*`,
        options
    ).then(next);
};

module.exports = [ editAnswer, answerCallback ];

