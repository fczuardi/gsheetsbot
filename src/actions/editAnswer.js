const editAnswer = (ctx, next) => {
    const answerIndex = parseInt(ctx.match[2], 10);
    const question = ctx.session.questions[answerIndex][1];
    ctx.session.answerToEdit = answerIndex; //eslint-disable-line
    ctx.session.awaitingInput = 'editAnswer'; // eslint-disable-line
    return ctx.editMessageText(
        `Ok, digite a novamente:\n*${question}*`,
        { parse_mode: 'Markdown' }
    ).then(next);
};

module.exports = [ editAnswer ];

