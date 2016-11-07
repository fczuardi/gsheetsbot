const tgd = require('telegraf-googledrive');
const config = require('../config');
const extend = require('xtend');

const { rootId } = config;

const setCurrentFile = (ctx, next) => {
    console.log('setCurrentFile');
    const fileId = ctx.callbackQuery.match[2];
    const file = ctx.state.folders[rootId].filter(f => f.id === fileId);
    console.log(fileId, file);
    const { mimeType } = file[0];
    const fileType = mimeType.indexOf('video') !== -1 ? 'video' : 'document';
    const nextState = extend(ctx.state,
        { currentFile: {
            fileId
            , fileType
        } });
    ctx.state = nextState; //eslint-disable-line
    console.log('ctx.state ', ctx.state);
    return next();
};

const sendFile = tgd.replyFile({ path: config.drive.tempFolder });


module.exports = [
    setCurrentFile
    , sendFile
];
