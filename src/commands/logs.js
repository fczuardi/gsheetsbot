// command to download the logfile

const config = require('../config');

const sendLogFile = (ctx, next) => {
    console.log('sendLogFile command');
    console.log(ctx.state.isAdmin);
    if (!ctx.state.isAdmin) {
        console.error('User not allowed to run /logs command');
        return next();
    }
    const filePath = config.log.filename;
    return ctx.replyWithDocument({ source: filePath })
        .catch(console.error).then(next);
};

module.exports = [ sendLogFile ];
