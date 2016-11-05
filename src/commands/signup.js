const config = require('../config');
const loadTable = require('../middlewares/load');
const addUserStatus = require('../middlewares/userStatus');

const loadQuestions = loadTable(config.sheets.user.questions);
const loadUserStatus = loadTable(config.sheets.user.status);

const signup = (ctx, next) => {
    console.log('ctx.state.sheets', ctx.state.sheets);
    return next();
};

const command =
    [ loadQuestions
    , loadUserStatus
    , addUserStatus
    , signup
    ];

module.exports = command;

