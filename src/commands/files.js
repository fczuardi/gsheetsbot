const tgd = require('telegraf-googledrive');
const replies = require('../replies');
const config = require('../config');
const oauthClient = require('../oauth');
const sequenceReply = require('../sequenceReply');

const replyTextMaxLength = 309;

const { rootId, fields } = config.drive;

const makeKeyboard = (ctx, next) => {
    const folders = ctx.state.folders[rootId];
    const inlineKeyboard = folders.map(file => {
        const isSubFolder = (file.mimeType === 'application/vnd.google-apps.folder');
        const isReadme = file.name.toLowerCase() === 'readme.md';

        if (isReadme) { return null; }

        if (isSubFolder) {
            return [
                { text: file.name
                , callback_data: `changeFolder ${file.id}`
                }
            ];
        }
        return [
            { text: file.name
            , callback_data: `sendFile ${file.id}`
            }
        ];
    }).filter(i => i !== null);

    inlineKeyboard.concat(ctx.state.defaultKeyboard || []);

    const replyOptions = { reply_markup: { inline_keyboard: inlineKeyboard }
        , disable_web_page_preview: true };
    const folderDescription = ctx.state.folders.description
        || replies.docs.defaultDescription || '';
    const paragraphs = folderDescription.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.slice(0, replyTextMaxLength));
    const lastReply = () => ctx.replyWithMarkdown(
        paragraphs[paragraphs.length - 1], replyOptions
    ).then(next).catch(console.error);
    if (paragraphs.length) {
        return sequenceReply(ctx, paragraphs.slice(0, -1)).then(lastReply);
    }
    return lastReply();
};

const filesToState = tgd.getFolder({ rootId, fields, auth: oauthClient });

/* Sets message description to ctx.state.folder.description from google drive README.md file
 */
const setDescription = tgd.setDescription(
    { path: config.drive.tempFolder
    , auth: oauthClient
    }
);

module.exports = [
    filesToState
    , setDescription
    , makeKeyboard
];

