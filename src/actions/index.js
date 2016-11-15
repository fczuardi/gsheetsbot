const editAnswer = require('./editAnswer');
const changeSchoolAnswer = require('./changeSchoolAnswer');
const editSchoolAnswer = require('./editSchoolAnswer');
const submitUserForm = require('./submitUserForm');
const submitSchoolForm = require('./submitSchoolForm');
const reviewUserForm = require('./reviewUserForm');
const reviewSchoolForm = require('./reviewSchoolForm');
const sendFile = require('./sendFile');
const changeFolder = require('./changeFolder');
const schoolForm = require('./schoolForm');

const actions =
    { submitUserForm
    , submitSchoolForm
    , reviewUserForm
    , reviewSchoolForm
    , sendFile
    , changeFolder
    , editAnswer
    , changeSchoolAnswer
    , editSchoolAnswer
    , schoolForm
    };

module.exports = actions;

