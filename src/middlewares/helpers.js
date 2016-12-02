const isCallback = ctx => ctx.updateType === 'callback_query';

const callbackReply = (ctx, next) =>
    ctx.answerCallbackQuery().then(next).catch(console.error);

const lib =
    { isCallback
    , callbackReply
    };

module.exports = lib;
