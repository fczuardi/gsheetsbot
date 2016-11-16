const Telegraf = require('telegraf');
const startCommand = require('../commands/start');
const replies = require('../replies');
const config = require('../config');
const sequenceReply = require('../sequenceReply');

const termsOfService = (ctx, next) => {
    const hasAccepted = ctx.session.acceptedTOS;
    const hasAnswered = hasAccepted !== undefined;

    // continue if the user have accepted the terms already
    if (hasAccepted) {
        return next();
    }

    const message = ctx.update.message || { text: '' };
    const text = message.text;
    const hasJustAccepted = (text === replies.tos.accept);
    ctx.session.acceptedTOS = hasJustAccepted;

    // start flow if the user just accepted
    if (hasJustAccepted) {
        const hideKeyboard = { reply_markup: { hide_keyboard: true } };
        return ctx.replyWithMarkdown(replies.tos.accepted, hideKeyboard).then(() =>
            Telegraf.compose(startCommand)(ctx, next)
        );
    }

    // TOS text to show to the user
    const tosText = !hasAnswered
        ? replies.tos.text(config.tos.url)
        : replies.tos.deniedReply;

    // custom keyboard with I agree / I do not agree replies
    const replyKeyboard =
        { keyboard: [
            [ { text: replies.tos.accept }
            , { text: replies.tos.deny }
            ]
        ] };

    const finalLine = () => ctx.replyWithMarkdown(tosText,
        { reply_markup: replyKeyboard
        , disable_web_page_preview: true
        }
    );

    // stop middleware propagation with the question input
    const replyPromise = !hasAnswered
        ? sequenceReply(ctx,
            replies.start.welcome(ctx.state.displayName)).then(finalLine)
        : finalLine();
    return replyPromise.catch(console.error);
};

module.exports = termsOfService;

