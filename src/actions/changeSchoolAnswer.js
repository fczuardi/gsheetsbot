const Telegraf = require('telegraf');
const reviewSchoolForm = require('./reviewSchoolForm');

const changeSchoolAnswer = (ctx, next) => {
    console.log('-- -- changeSchoolAnswer -- -- ')
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
    ctx.session.schoolAnswers[ctx.session.answerToEdit] = text;
    return Telegraf.compose(reviewSchoolForm)(ctx, next);
};

module.exports = [ changeSchoolAnswer ];

