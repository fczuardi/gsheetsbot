const Telegraf = require('telegraf');
const replies = require('../replies');
const config = require('../config');

const updateCameFromGroup = ctx => `${ctx.update.message.chat.type}` === 'group';

const updateCameFromBroadcastGroup = ctx =>
    `${ctx.update.message.chat.id}` === config.telegram.broadcastGroup;

const supportedUpdate = ctx => {
    const { text } = ctx.message;
    const isBroadcastCommand = text.toLowerCase().indexOf('/broadcast') !== -1;
    const isConfirmation = false;
    return isBroadcastCommand || isConfirmation;
};

const reviewMessage = (ctx, next) => {
    const { text } = ctx.message;
    const pattern = new RegExp('(/broadcast)( *)(.*)');
    const matches = text.match(pattern);
    const msg = matches[3];
    const options = { reply_markup: { inline_keyboard: [
        [ { text: 'sim', switch_inline_query_current_chat: 'Foo' }
        , { text: 'nao', switch_inline_query_current_chat: 'Bar' }
        ]
    ] } };
    return ctx.replyWithMarkdown(replies.broadcast.confirm).then(
        () => ctx.replyWithMarkdown(msg, options).then((f) => {
            console.log({ f });
            return next();
        })
    );
};

const middleware = Telegraf.branch(updateCameFromBroadcastGroup,
    Telegraf.branch(supportedUpdate, reviewMessage, () => null),
    Telegraf.branch(updateCameFromGroup, () => null, (ctx, next) => next())
);

module.exports = middleware;

