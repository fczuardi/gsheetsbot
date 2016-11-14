const replies = require('../replies');
const termsOfService = (ctx, next) => {
    const hasAccepted = ctx.session.acceptedTOS;
    // continue if the user have accepted the terms already
    if (hasAccepted || ctx.session.awaitingInput) {
        return next();
    }

    // set session.awaitingInput to 'tos'
    ctx.session.awaitingInput = 'tos';

    // TOS text to show to the user
    const tosText = hasAccepted === undefined
        ? replies.tos.text
        : replies.tos.deniedReply;

    // custom keyboard with I agree / I do not agree replies
    const replyKeyboard =
        { one_time_keyboard: true
        , keyboard: [
            [ { text: replies.tos.accept }
            , { text: replies.tos.deny }
            ]
        ] };

    // stop middleware propagation with the question input
    return ctx.reply(tosText, { reply_markup: replyKeyboard });
};

module.exports = termsOfService;

