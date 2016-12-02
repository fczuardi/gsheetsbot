const start = require('./start');
const status = require('./status');
const token = require('./token');
const school = require('../actions/schoolForm');
const logs = require('./logs');
const contact = require('./contact');

const commands =
    { status
    , start
    , token
    , indicar: school
    , logs
    , contato: contact
    };

module.exports = commands;

