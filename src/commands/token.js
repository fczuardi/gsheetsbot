const replies = require('../replies');
const token = ctx => {
    if (!ctx.state.isAdmin) {
        return ctx.reply(replies.token.unauthorized);
    }
    return ctx.reply(`admins ${ctx.state.loginUrl}`);
};

module.exports = token;

