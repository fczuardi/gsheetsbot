const Telegraf = require('telegraf');
const config = require('../config');
const broadcastMiddleware = require('./broadcast');
const supportMiddleware = require('./support');

const updateCameFromGroup = ctx => {
    const update = ctx.update.callback_query || ctx.update;
    return `${update.message.chat.type}` === 'group';
};

const updateCameFromTheGroup = groupId => ctx => {
    const update = ctx.update.callback_query || ctx.update;
    const chatId = update.message.chat.id;
    return `${chatId}` === groupId;
};

const updateCameFromBroadcastGroup = updateCameFromTheGroup(config.telegram.broadcastGroup);

const updateCameFromSupportGroup = updateCameFromTheGroup(config.telegram.supportGroup);

const groupMiddlewares = Telegraf.branch(updateCameFromGroup,
    Telegraf.compose(
        [ Telegraf.branch(updateCameFromBroadcastGroup, broadcastMiddleware, (ctx, next) => next())
        , Telegraf.branch(updateCameFromSupportGroup, supportMiddleware, () => null)
        ]
    ),
    (ctx, next) => next()
);

module.exports = groupMiddlewares;
