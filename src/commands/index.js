// const start = require('./start');
const signup = require('./signup');
const status = require('./status');
const token = require('./token');
const help = require('./help');
const settings = require('./settings');
const files = require('./files');

const commands =
    { status
    , signup
    // , start
    , token
    , help
    , files
    , settings
    };

module.exports = commands;

