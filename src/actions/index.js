const editAnswer = require('./editAnswer');
const submitUserForm = require('./submitUserForm');
const reviewUserForm = require('./reviewUserForm');
const sendFile = require('./sendFile');
const changeFolder = require('./changeFolder');

const actions =
    { submitUserForm
    , reviewUserForm
    , sendFile
    , changeFolder
    , editAnswer
    };

module.exports = actions;

