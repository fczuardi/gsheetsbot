const extend = require('xtend');
const sheetUser = (ctx, next) => {
    console.log('sheetUser middleware');
    const userId = `${ctx.from.id}`;
    const sheetBody = ctx.state.sheet.body;
    // TBD: get the proper column from config
    // and check for userId just on that column
    const rowWithUserId = sheetBody.find(row => row.includes(userId));
    const hasApplied = rowWithUserId !== undefined;
    const isApproved = rowWithUserId[rowWithUserId.length - 1] === 'Approved';
    const nextState = extend(ctx.state, { hasApplied, isApproved });
    ctx.state = nextState; // eslint-disable-line
    return next();
};

module.exports = sheetUser;

