const { makeEditAnswerAction } = require('../formQuestion');
const answerCallback = (ctx, next) => (ctx.updateType === 'callback_query'
    ? ctx.answerCallbackQuery().then(next).catch(console.error)
    : next()
);

const callbackData = 'changeUserAnswer';
const awaitingInput = 'editUserAnswer';
const editAnswer = makeEditAnswerAction(callbackData, awaitingInput);

module.exports = [ editAnswer, answerCallback ];

