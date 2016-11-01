const admin = ctx => {
    ctx.reply(`admins ${ctx.state.isAdmin}`);
};

module.exports = admin;

