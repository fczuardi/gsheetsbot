const Telegraf = require('telegraf');
const reviewUserForm = require('./reviewUserForm');

const changeUserAnswer = (ctx, next) => {
    console.log('-- -- changeUserAnswer -- -- ')
    if (!ctx.match) {
        console.error('missing callback parameter');
        return next();
    }
    if (!ctx.session.answerToEdit) {
        console.error('lost session');
        return next();
    }
    console.log('ctx.session.answerToEdit', ctx.session.answerToEdit);
    const text = ctx.match[2];
    ctx.session.answers[ctx.session.answerToEdit] = text;
    return Telegraf.compose(reviewUserForm)(ctx, next);
};

module.exports = [ changeUserAnswer ];

