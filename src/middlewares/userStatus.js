const Telegraf = require('telegraf');
const extend = require('xtend');
const loadSheet = require('../middlewares/load');
const tgs = require('telegraf-googlesheets');
const config = require('../config');

// this middleware adds 4 properties into the state:
// userHasApplied, userStatus, userIsApproved and statusNote
// based on the sheet property values
const userStatusMiddleware = (ctx, next) => {
    const userId = `${ctx.from.id}`;
    const sheetName = tgs.getSheetName(config.sheets.user.status);
    const sheetData = ctx.state.sheets[sheetName] || [];
    const userIdColumn = config.sheets.user.statusUserId;
    const userStatusColumn = config.sheets.user.statusColumn;
    const userNotesColumn = config.sheets.user.statusNotesColumn;
    const rowWithUserId = sheetData.find(
        row => row[userIdColumn] === userId
    );
    const userHasApplied = rowWithUserId !== undefined;
    // console.log('rowWithUserId', rowWithUserId);
    const userStatus = rowWithUserId
        ? rowWithUserId[userStatusColumn]
        : null;
    const statusNote = rowWithUserId
        ? rowWithUserId[userNotesColumn]
        : null;
    const userIsApproved = userStatus === config.sheets.user.approvedValue;

    const newProperties =
        { userHasApplied
        , userStatus
        , userIsApproved
        , statusNote
        };

    const nextState = extend(ctx.state, newProperties);
    // console.log('userStatus', newProperties);
    ctx.state = nextState;
    return next();
};

module.exports = Telegraf.compose(
    [ loadSheet(config.sheets.user.status)
    , userStatusMiddleware
    ]);

