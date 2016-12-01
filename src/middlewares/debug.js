const debug = (ctx, next) => {
    // console.log('[DEBUG] update =\n', JSON.stringify(ctx, ' ', 2));
    console.log('ctx.updateType', ctx.updateType);
    // console.log('ctx.inlineQuery', ctx.inlineQuery);
    // console.log('ctx.chosenInlineResult', ctx.chosenInlineResult);
    // console.log('ctx.callbackQuery', ctx.callbackQuery);
    console.log('[DEBUG] update =\n', JSON.stringify(ctx.update));
    return next();
};

module.exports = debug;

