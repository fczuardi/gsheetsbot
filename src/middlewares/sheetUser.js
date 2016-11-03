const extend = require('xtend');
require('toml-require').install();
const config = require('../../config.toml');

// this middleware adds 3 propertiesinto the state:
// userHasApplied, userStatus and userIsApproved
// based on the sheet property values
const sheetUser = (ctx, next) => {
    console.log('sheetUser middleware');
    const userId = `${ctx.from.id}`;
    const sheetBody = ctx.state.sheet.body || [ null, null, null ];
    const userIdColumnIndex = sheetBody[0].length - 2;
    const userStatusColumnIndex = config.sheet.userStatusColumn - 1;
    const rowWithUserId = sheetBody.find(
        row => row[userIdColumnIndex] === userId
    );
    const userHasApplied = rowWithUserId !== undefined;
    const userStatus = rowWithUserId
        ? rowWithUserId[userStatusColumnIndex]
        : null;
    const userIsApproved = userStatus === config.sheet.userApprovedValue;

    const newProperties =
        { userHasApplied
        , userStatus
        , userIsApproved
        };

    const nextState = extend(ctx.state, newProperties);
    ctx.state = nextState; // eslint-disable-line
    return next();
};

module.exports = sheetUser;

