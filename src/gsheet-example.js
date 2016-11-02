const google = require('googleapis');

require('toml-require').install();
const config = require('../config.toml');
const oauth2Client = require('./oauth');

const gsheets = google.sheets('v4');
const pattern = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
const spreadsheetId = config.sheet.url.match(pattern)[1];

console.log('spreadsheetId', spreadsheetId);

const params =
    { auth: oauth2Client
    , spreadsheetId
    , range: config.sheet.dataRange
    };
gsheets.spreadsheets.values.get(params, (err, response) => {
    if (err) {
        console.error(err);
        return err;
    }
    const head = response.values[0];
    const body = response.values.slice(1);
    console.log('head', head);
    console.log('body', body);

    return response;
});
