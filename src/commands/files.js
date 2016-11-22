const Telegraf = require('telegraf');
const extend = require('xtend');
const tgd = require('telegraf-googledrive');
const replies = require('../replies');
const config = require('../config');
const oauthClient = require('../oauth');
const sequenceReply = require('../sequenceReply');

const replyTextMaxLength = 309;

const { rootId, fields } = config.drive;

const makeKeyboard = (ctx, next) => {
    // console.log('state folders', JSON.stringify(ctx.state.folders, ' ', 2));
    if (!ctx.state.folders) {
        console.error('folder no longer on state');
        return next();
    }
    const currentFolderId = ctx.state.rootId || rootId;
    const useCustomKeyboard = config.drive.useCustomKeyboard;
    const folders = ctx.state.folders[currentFolderId];
    const filesKeyboard = folders.map(file => {
        const isSubFolder = (file.mimeType === 'application/vnd.google-apps.folder');
        const isReadme = file.name.toLowerCase() === 'readme.md';

        if (isReadme) { return null; }

        if (isSubFolder) {
            const parents = ctx.session.parents || {};
            const newParents = extend(parents, { [file.id]: file.parents[0] });
            ctx.session.parents = newParents;
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

    console.log('ctx.state.defaultKeyboard', ctx.state.defaultKeyboard);
    const inlineKeyboard = filesKeyboard.concat(ctx.state.defaultKeyboard || []);
    const keyboard = useCustomKeyboard
        ? { keyboard: inlineKeyboard }
        : { inline_keyboard: inlineKeyboard };
    if (useCustomKeyboard) {
        console.log('customKeyboard', JSON.stringify(inlineKeyboard));
        const textCommands = inlineKeyboard.reduce((prev, buttonRow) => {
            console.log({ buttonRow });
            if (!buttonRow.length) {
                return extend({}, prev);
            }
            const button = buttonRow[0];
            return extend({}, prev, { [button.text]: button.callback_data });
        }, {});
        ctx.session.textCommands = textCommands;
        ctx.session.lastMenu = inlineKeyboard;
    }
    const replyOptions = { reply_markup: keyboard, disable_web_page_preview: true };
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

const filesToStateDefault = tgd.getFolder({ rootId, fields, auth: oauthClient });
const filesToStateWithoutRoot = tgd.getFolder({ fields, auth: oauthClient });

const filesToState = Telegraf.branch(ctx => ctx.state.rootId,
    filesToStateWithoutRoot,
    filesToStateDefault
);

/* Sets message description to ctx.state.folder.description from google drive README.md file
 */
const setDescription = tgd.setDescription(
    { path: config.drive.tempFolder
    , auth: oauthClient
    }
);

const callbackEnd = (ctx, next) => {
    if (ctx.updateType !== 'callback_query') {
        return next();
    }
    return ctx.editMessageReplyMarkup().then(() =>
        ctx.answerCallbackQuery().then(next).catch(console.error)
    );
};

const command =
    [ filesToState
    , setDescription
    , callbackEnd
    , makeKeyboard
    ];

module.exports = command;

