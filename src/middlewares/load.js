const tgs = require('telegraf-googlesheets');
const oauth2Client = require('../oauth');
const config = require('../config');

const pattern = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
const spreadsheetId = config.sheets.url.match(pattern)[1];
const createLoadSheetMiddleware = range => {
    console.log('range', range);
    const params =
        { auth: oauth2Client
        , spreadsheetId
        , range
        };
    return tgs.createMiddleware(params);
};

module.exports = createLoadSheetMiddleware;

