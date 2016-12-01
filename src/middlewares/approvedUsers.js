const Telegraf = require('telegraf');
const extend = require('xtend');
const loadSheet = require('../middlewares/load');
const tgs = require('telegraf-googlesheets');
const config = require('../config');

// this middleware adds a property into the state:
// approvedUsers that contains a list of approved users
const approvedUsersMiddleware = (ctx, next) => {
    const sheetName = tgs.getSheetName(config.sheets.user.status);
    const sheetData = ctx.state.sheets[sheetName] || [];
    const userIdColumn = config.sheets.user.statusUserId;
    const userStatusColumn = config.sheets.user.statusColumn;
    const approvedUsers = sheetData.filter(row =>
       row[userStatusColumn] === config.sheets.user.approvedValue
    ).map(row => row[userIdColumn]);

    const newProperties = { approvedUsers };
    const nextState = extend(ctx.state, newProperties);

    ctx.state = nextState;
    return next();
};

module.exports = Telegraf.compose(
    [ loadSheet(config.sheets.user.status)
    , approvedUsersMiddleware
    ]);

