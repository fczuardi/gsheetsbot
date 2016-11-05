// const start = require('./start');
const signup = require('./signup');
const status = require('./status');
const token = require('./token');
const help = require('./help');
const settings = require('./settings');

const commands =
    { status
    , signup
    // , start
    , token
    , help
    , settings
    };

module.exports = commands;

