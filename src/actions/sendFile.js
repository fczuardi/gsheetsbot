const tgd = require('telegraf-googledrive');
const oauthClient = require('../oauth');
const config = require('../config');
const extend = require('xtend');

const { rootId, fields } = config.drive;

const setCurrentFile = (ctx, next) => {
    console.log('setCurrentFile');
    const fileId = ctx.match[2];
    const file = ctx.state.folders[rootId].filter(f => f.id === fileId);
    console.log(fileId, file);
    const { mimeType } = file[0];
    const fileType = mimeType.indexOf('video') !== -1 ? 'video' : 'document';
    const nextState = extend(ctx.state,
        { currentFile: {
            fileId
            , fileType
        } });
    console.log('ctx.state ', ctx.state);
    ctx.state = nextState;
    return next();
};

const filesToState = tgd.getFolder({ rootId, fields, auth: oauthClient });
const sendFile = tgd.replyFile({ path: config.drive.tempFolder, auth: oauthClient });


module.exports = [
    filesToState
    , setCurrentFile
    , sendFile
];
