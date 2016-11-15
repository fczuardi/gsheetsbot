const tgd = require('telegraf-googledrive');
const oauthClient = require('../oauth');
const config = require('../config');
const extend = require('xtend');

const { fields } = config.drive;

const setRootId = (ctx, next) => {
    ctx.state.rootId = ctx.session.currentFolder;
    return next();
};

const setCurrentFile = (ctx, next) => {
    console.log('setCurrentFile');
    const fileId = ctx.match[2];
    console.log('fileId', fileId, ctx.session.currentFolder);
    console.log('state folders', ctx.state.folders);
    const currentFolderFiles = ctx.state.folders[ctx.session.currentFolder] || [];
    console.log('currentFolderFiles', currentFolderFiles);
    const file = currentFolderFiles.filter(f => f.id === fileId);
    console.log(fileId, file);
    if (!file) {
        console.error('file not found');
        return next();
    }
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

const filesToState = tgd.getFolder({ fields, auth: oauthClient });
const sendFile = tgd.replyFile({ path: config.drive.tempFolder, auth: oauthClient });

const action =
    [ setRootId
    , filesToState
    , setCurrentFile
    , sendFile
    ];

module.exports = action;
