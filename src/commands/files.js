const { getFolder } = require('telegraf-googledrive');
const config = require('../config');
const oauthClient = require('../oauth');

const { rootId, fields } = config.drive;

const useFiles = (ctx, next) => {
    console.log('DEBUG: state ', ctx.state[rootId]);
    console.log('ctx.state: ', ctx.state.folders[rootId]);
    ctx.reply(`Se liga: ${JSON.stringify(ctx.state.folders[rootId])}`);

    const folders = ctx.state.folders[rootId];
    const buttons = [];

    console.log('Vamos começar a putaria');
    folders.forEach(file => {
        console.log('file: ', file);
        // this file is an subfolder
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            buttons.push([ { text: file.name } ]);
        // this file is a markdown, therefore the descrition
        } else if (file.mineType === 'text/markdown') {
            description = file; //eslint-disable-line
        // this file is a regular file
        } else {
            buttons.push([ { text: file.name } ]);
        }
    });

    console.log('Enviando resposta');
    ctx.replyWithMarkdown('Descrição bonita aqui', { reply_markup: {
        resize_keyboard: true
        , one_time_keyboard: true
        , keyboard: buttons
    } });

    return next();
};

const filesToState = getFolder({ rootId, fields, auth: oauthClient });

module.exports = [
    filesToState
    , useFiles
];

