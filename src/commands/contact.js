const Telegraf = require('telegraf');
const config = require('../config');
const replies = require('../replies');

const telegram = new Telegraf.Telegram(config.telegram.token);

const awaitingInput = ctx =>
    ctx.session.awaitingInput && ctx.session.awaitingInput === 'support';

const getInput = (ctx, next) => {
    ctx.session.awaitingInput = 'support';
    return ctx.replyWithMarkdown(
        replies.support.userHelp
    ).then(next);
};

const sendMessage = (ctx, next) => {
    ctx.session.awaitingInput = null;
    const messageId = ctx.update.message.message_id;
    const fromChatId = ctx.update.message.chat.id;
    const chatId = config.telegram.supportGroup;
    const extra = {};
    global.tickets = global.tickets || {};
    return telegram.forwardMessage(
        chatId, fromChatId, messageId, extra
    ).then(message => {
        global.tickets[message.message_id] = messageId;
        return ctx.replyWithMarkdown(
           replies.support.userSuccess
        ).then(next).catch(console.error);
    });
};

const command = Telegraf.branch(awaitingInput, sendMessage, getInput);

module.exports = [ command ];
