const start = require('./start');
const status = require('./status');
const token = require('./token');
const school = require('../actions/schoolForm');

const commands =
    { status
    , start
    , token
    , indicar: school
    };

module.exports = commands;

