const sequenceReply = (ctx, msgs, index = 0) => {
    const text = msgs[index];
    if (!text) {
        return new Promise(resolve => resolve());
    }
    const replyPromise = ctx.replyWithMarkdown(
        msgs[index],
        { disable_web_page_preview: true }
    );
    if (index === msgs.length - 1){
        return replyPromise;
    }
    const onResolve = () => sequenceReply(ctx, msgs, index + 1);
    return replyPromise.then(onResolve);
}

module.exports = sequenceReply;

