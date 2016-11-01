const replies = require('../replies');
const admin = ctx => {
    if (!ctx.state.isAdmin) {
        return ctx.reply(replies.admin.unauthorized);
    }
    return ctx.reply(`admins ${ctx.state.loginUrl}`);
};

module.exports = admin;

