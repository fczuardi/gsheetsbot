const start = require('./start');
const status = require('./status');
const token = require('./token');
const school = require('../actions/schoolForm');
const logs = require('./logs');

const commands =
    { status
    , start
    , token
    , indicar: school
    , logs
    };

module.exports = commands;

