const tgs = require('telegraf-googlesheets');
const oauth2Client = require('../oauth');
const config = require('../config');

const spreadsheetId = tgs.getSheetId(config.sheets.url);
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

