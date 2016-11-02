const google = require('googleapis');
const extend = require('xtend');
const oauth2Client = require('../oauth');
require('toml-require').install();
const config = require('../../config.toml');

const gsheets = google.sheets('v4');
const pattern = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
const spreadsheetId = config.sheet.url.match(pattern)[1];

console.log('spreadsheetId', spreadsheetId);

const params =
    { auth: oauth2Client
    , spreadsheetId
    , range: config.sheet.dataRange
    };

const loadSheet = (ctx, next) => {
    console.log('loadSheet middleware');
    gsheets.spreadsheets.values.get(params, (err, response) => {
        if (err) {
            console.error(err);
            return err;
        }
        const sheet =
            { head: response.values[0]
            , body: response.values.slice(1)
            };

        console.log('sheet', sheet);

        const nextState = extend(ctx.state, { sheet });
        ctx.state = nextState; // eslint-disable-line
        return next();
    });
};

module.exports = loadSheet;

