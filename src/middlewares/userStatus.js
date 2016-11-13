const extend = require('xtend');
const tgs = require('telegraf-googlesheets');
const config = require('../config');

// this middleware adds 3 properties into the state:
// userHasApplied, userStatus and userIsApproved
// based on the sheet property values
const userStatusMiddleware = (ctx, next) => {
    const userId = `${ctx.from.id}`;
    const sheetName = tgs.getSheetName(config.sheets.user.status);
    const sheetData = ctx.state.sheets[sheetName] || [];
    const userIdColumn = config.sheets.user.statusUserId;
    const userStatusColumn = config.sheets.user.statusColumn;
    const rowWithUserId = sheetData.find(
        row => row[userIdColumn] === userId
    );
    const userHasApplied = rowWithUserId !== undefined;
    const userStatus = rowWithUserId
        ? rowWithUserId[userStatusColumn]
        : null;
    const userIsApproved = userStatus === config.sheets.user.approvedValue;

    const newProperties =
        { userHasApplied
        , userStatus
        , userIsApproved
        };

    const nextState = extend(ctx.state, newProperties);
    ctx.state = nextState;
    return next();
};

module.exports = userStatusMiddleware;

