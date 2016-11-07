const editAnswer = (ctx, next) => {
    ctx.reply(`so you want to edit your answer ${JSON.stringify(ctx.callbackQuery)}`);
    ctx.reply(`so you want to edit your answer ${JSON.stringify(ctx.match)}`);
    return next();
};

module.exports = [ editAnswer ];

