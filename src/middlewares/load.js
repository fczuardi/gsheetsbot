const tgs = require('telegraf-googlesheets');
const oauth2Client = require('../oauth');
const config = require('../config');

const pattern = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
const spreadsheetId = config.sheet.url.match(pattern)[1];
const params =
    { auth: oauth2Client
    , spreadsheetId
    , range: config.sheet.dataRange
    };
const loadSheet = tgs(params);

module.exports = loadSheet;

