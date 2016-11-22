const config = require('../config');
const filesCommand = require('../commands/files');
const changeFolder = (ctx, next) => {
    if (!ctx.session.parents) {
        console.error('lost parents from session');
        return next();
    }
    const rootId = ctx.match[2];
    const parentFolder = ctx.session.parents[rootId];
    const customSubfolders = config.drive.subFolderExtraButtons;
    const customization = customSubfolders.filter(folder => folder.id === rootId);
    console.log('--- - - changeFolder -- ', customSubfolders, customization);
    ctx.state.rootId = rootId;
    ctx.session.currentFolder = rootId;
    const extraButtons = !customization ? [] : customization.map(b => {
        const button =
            { text: b.text
            , callback_data: b.callbackData
            };
        return [ button ];
    });
    const backButton = !parentFolder ? [] : [ [
        { text: 'Voltar'
        , callback_data: `changeFolderUp ${parentFolder}`
        }
    ] ];
    const defaultKeyboard = extraButtons.concat(backButton);
    ctx.state.defaultKeyboard = defaultKeyboard;
    return next();
};

const action =
    [ changeFolder
    , ...filesCommand
    ];

module.exports = action;

