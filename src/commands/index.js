const start = require('./start');
const signup = require('./signup');
const status = require('./status');
const token = require('./token');
const help = require('./help');
const settings = require('./settings');
const files = require('./files');
const school = require('../actions/schoolForm');

const commands =
    { status
    , signup
    , start
    , token
    , help
    , files
    , indicar: school
    , settings
    };

module.exports = commands;

