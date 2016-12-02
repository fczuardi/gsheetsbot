const extend = require('xtend');
const { Telegram } = require('telegraf');
const config = require('../config');
const replies = require('../replies');

const telegram = new Telegram(config.telegram.token);

const supportMiddleware = ctx => {
    // console.log('SUPPORT MIDDLEWARE');
    const replyToMessage = ctx.message.reply_to_message;
    const removeKeyboard = { reply_markup: { remove_keyboard: true } };
    if (!replyToMessage) {
        return ctx.reply(replies.support.adminHelp, removeKeyboard);
    }
    const reply = ctx.message.text;
    const { id } = replyToMessage.forward_from;
    const originalId = global.tickets && global.tickets[replyToMessage.message_id];
    const extra = extend(
        removeKeyboard, originalId ? { reply_to_message_id: originalId } : {}
    );
    return telegram.sendMessage(
        id, reply, extra
    ).then(() => ctx.replyWithMarkdown(
        replies.support.success
    ));
};

module.exports = supportMiddleware;

