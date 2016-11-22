const editUserAnswer = require('./editUserAnswer');
const editSchoolAnswer = require('./editSchoolAnswer');
const changeUserAnswer = require('./changeUserAnswer');
const changeSchoolAnswer = require('./changeSchoolAnswer');
const submitUserForm = require('./submitUserForm');
const submitSchoolForm = require('./submitSchoolForm');
const reviewUserForm = require('./reviewUserForm');
const reviewSchoolForm = require('./reviewSchoolForm');
const sendFile = require('./sendFile');
const changeFolder = require('./changeFolder');
const schoolForm = require('./schoolForm');
const status = require('../commands/status');

const actions =
    { submitUserForm
    , submitSchoolForm
    , reviewUserForm
    , reviewSchoolForm
    , sendFile
    , changeFolder
    , editUserAnswer
    , editSchoolAnswer
    , changeUserAnswer
    , changeSchoolAnswer
    , schoolForm
    , status
    };

module.exports = actions;

