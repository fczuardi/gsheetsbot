const tgd = require('telegraf-googledrive');
const config = require('../config');
const oauthClient = require('../oauth');

const replyTextMaxLength = 309;

const { rootId, fields } = config.drive;

const makeKeyboard = (ctx, next) => {
    console.log('ctx.state: ', ctx.state.folders[rootId]);

    const folders = ctx.state.folders[rootId];
    const inlineKeyboard = [];
    folders.forEach(file => {
        // this file is an subfolder
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            inlineKeyboard.push([
                { text: file.name
                    , callback_data: `changeFolder,${file.id}`
                }
            ]);
        } else {
            inlineKeyboard.push([
                { text: file.name
                    , callback_data: `sendFile,${file.id}`
                }
            ]);
        }
    });

    inlineKeyboard.concat(ctx.state.defaultKeyboard || []);

    const replyOptions = { reply_markup: { inline_keyboard: inlineKeyboard }
        , disable_web_page_preview: true };
    const replyText = ctx.state.folders.description.slice(0, replyTextMaxLength)
        || 'default decryption';
    return ctx.replyWithMarkdown(
        replyText, replyOptions
    ).then(next).catch(console.error);
};

const filesToState = tgd.getFolder({ rootId, fields, auth: oauthClient });

/* Sets message description to ctx.state.folder.description from google drive README.md file
 */
const setDescription = tgd.setDescription({ path: config.drive.tempFolder , auth: oauthClient}); //eslint-disable-line

module.exports = [
    filesToState
    , setDescription
    , makeKeyboard
];

