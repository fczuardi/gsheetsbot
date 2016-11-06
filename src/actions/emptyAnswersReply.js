const replies = require('../replies');

const emptyAnswersReply = (ctx, next) =>
    ctx.editMessageText(
        replies.signup.emptyAnswersError
    ).then(next).catch(err => {
        console.error(err);
        return next();
    });

module.exports = emptyAnswersReply;

