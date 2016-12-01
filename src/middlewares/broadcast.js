const Telegraf = require('telegraf');
const replies = require('../replies');
const config = require('../config');
const loadApprovedUsers = require('./approvedUsers');

const telegram = new Telegraf.Telegram(config.telegram.token);

const updateCameFromGroup = ctx => `${ctx.update.message.chat.type}` === 'group';

const updateCameFromBroadcastGroup = ctx => {
    const update = ctx.update.callback_query || ctx.update;
    const chatId = update.message.chat.id;
    return `${chatId}` === config.telegram.broadcastGroup;
};

const supportedUpdate = ctx => {
    const update = ctx.update.callback_query || ctx.update;
    const { text } = update.message;
    const isBroadcastCommand = text.toLowerCase().indexOf('/broadcast') !== -1;
    const { data } = update;
    const pattern = new RegExp('cancelBroadcast|broadcast');
    const supportedCallback = data ? pattern.test(data) : null;
    return isBroadcastCommand || supportedCallback;
};

const isCallback = ctx => ctx.updateType === 'callback_query';

const reviewMessage = (ctx, next) => {
    const { text, message_id: messageId } = ctx.message;
    const pattern = new RegExp('(/broadcast)( *)(.*)');
    const matches = text.match(pattern);
    const msg = matches[3];
    const options = { reply_markup: { inline_keyboard: [ [
        { text: 'sim', callback_data: `broadcast ${messageId}` },
        { text: 'nao', callback_data: `cancelBroadcast ${messageId}` }
    ] ] } };
    ctx.session.broadcastMessages = ctx.session.broadcastMessages || {};
    ctx.session.broadcastMessages[messageId] = msg;
    return ctx.replyWithMarkdown(replies.broadcast.confirm).then(
        () => ctx.replyWithMarkdown(msg, options).then(next)
    );
};

const callbackReply = (ctx, next) =>
    ctx.answerCallbackQuery().then(next).catch(console.error);

const isBroadcastCommand = ctx =>
    ctx.update.callback_query.data.split(' ')[0] === 'broadcast';

const sendBroadcast = (ctx, next) => {
    const { data } = ctx.update.callback_query;
    const messageId = data.slice(data.indexOf(' ') + 1);
    const text = ctx.session.broadcastMessages && ctx.session.broadcastMessages[messageId];
    if (!text) {
        return ctx.editMessageText(
            replies.broadcast.sessionError
        ).then(next).catch(console.error);
    }
    const uniqueApprovedUsers = ctx.state.approvedUsers.filter(
        (id, index, array) => array.indexOf(id) === index
    );
    return Promise.all(
        uniqueApprovedUsers.map(userId =>
            telegram.sendMessage(userId
                , text
                , { parse_mode: 'Markdown' }
            ).catch(console.error)
        )
    ).then(() =>
        ctx.editMessageText(
            replies.broadcast.success(text), { parse_mode: 'Markdown' }
        ).then(next).catch(console.error)
    );
};

const broadcastCancel = (ctx, next) =>
    ctx.editMessageText(replies.broadcast.cancelled).then(next).catch(console.error);


const handleCallback = Telegraf.compose(
    [ callbackReply
    , Telegraf.branch(isBroadcastCommand
        , Telegraf.compose([ loadApprovedUsers, sendBroadcast ])
        , broadcastCancel)
    ]
);

const handleUpdate = Telegraf.branch(isCallback, handleCallback, reviewMessage);

const middleware = Telegraf.branch(updateCameFromBroadcastGroup,
    Telegraf.branch(supportedUpdate, handleUpdate, () => null),
    Telegraf.branch(updateCameFromGroup, () => null, (ctx, next) => next())
);

module.exports = middleware;

