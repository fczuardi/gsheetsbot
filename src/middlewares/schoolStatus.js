const extend = require('xtend');
const tgs = require('telegraf-googlesheets');
const config = require('../config');

const schoolStatusMiddleware = (ctx, next) => {
    // console.log('-- -- --schoolStatusMiddleware-- -- --');
    const userId = `${ctx.from.id}`;
    const sheetName = tgs.getSheetName(config.sheets.school.status);
    const sheetData = ctx.state.sheets[sheetName] || [];
    const userIdColumn = config.sheets.school.statusUserId;
    const nameColumn = config.sheets.school.schoolNameColumn;
    const statusColumn = config.sheets.school.statusColumn;
    const notesColumn = config.sheets.school.statusNotesColumn;
    const rowsWithUserId = sheetData.filter(
        row => row[userIdColumn] === userId
    );
    const userHasAppliedSchools = rowsWithUserId.length > 0;
    const schoolStatusList = rowsWithUserId.map(row => (
        { name: row[nameColumn]
        , status: row[statusColumn]
        , notes: row[notesColumn]
        }));
    const newProperties =
        { schoolStatusList
        , userHasAppliedSchools
        };

    const nextState = extend(ctx.state, newProperties);
    ctx.state = nextState;
    return next();
};

module.exports = schoolStatusMiddleware;

