const { makeEditAnswerQuestion } = require('../formQuestion');
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
    const callbackData = 'changeSchoolAnswer';
    ctx.session.answerToEdit = answerIndex;
    ctx.session.awaitingInput = 'editSchoolAnswer';
    return makeEditAnswerQuestion(ctx, currentQuestion, callbackData)
        .then(next).catch(console.error);
};

module.exports = [ editAnswer, answerCallback ];

