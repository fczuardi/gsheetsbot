const extend = require('xtend');
const google = require('googleapis');
const gsheets = google.sheets('v4');
const { Telegram } = require('telegraf');
const tgs = require('telegraf-googlesheets');
const oauth2Client = require('./oauth');
const config = require('./config');
const replies = require('./replies');

const spreadsheetId = tgs.getSheetId(config.sheets.url);
const range = config.sheets.user.status;
const params =
    { auth: oauth2Client
    , spreadsheetId
    , range
    };

const telegram = new Telegram(config.telegram.token);

const updateRows = newRows => {
    const resource = { values: newRows };
    const updateParams = extend(params, { resource, valueInputOption: 'USER_ENTERED' });
    return gsheets.spreadsheets.values.update(updateParams, (updateErr, updateRes) => {
        if (updateErr) {
            return console.error(updateErr);
        }
        // console.log({ updateRes });
        return updateRes;
    });
};

// cron job that will check a spreadsheet looking for approved and unnotified
// users, if there are any, notify all of them that they where approved and
// update the sheet by adding a character in a column flagging this
const createCron = (bot, refreshTime) => setInterval(() => {
    return gsheets.spreadsheets.values.get(params, (err, response) => {
        if (err) {
            console.log('cron job fetch error');
            return console.error(err);
        }
        const rows = response.values;
        if (!rows) {
            return null;
        }
        const { statusNotificationColumn
            , statusUserId
            , statusColumn
            , statusNotesColumn
            , approvedValue
            , deniedValue
        } = config.sheets.user;
        const usersToNotify = rows.filter(row => (
            row[statusNotificationColumn] === undefined &&
            [ approvedValue, deniedValue ].includes(row[statusColumn])
        ));
        const newRows = rows.map(row => {
            if (! [ approvedValue, deniedValue ].includes(row[statusColumn])){
                return row;
            }
            row[statusNotificationColumn] = config.sheets.user.notifiedValue;
            // see http://www.2ality.com/2012/06/dense-arrays.html
            return Array.apply(null, row).map(c =>
                (c === undefined ? '' : c)
            );
        });
        if (!usersToNotify.length) {
            return null;
        }
        console.log('cron has users to notify');
        console.log({ usersToNotify });
        return Promise.all(usersToNotify.map(row => {
            const messageText = row[statusColumn] === approvedValue
                ? replies.status.approved
                : replies.status.unapproved(row[statusNotesColumn])
            return telegram.sendMessage(row[statusUserId]
                , messageText
                , { parse_mode: 'Markdown' }).catch(console.error);
        })).then(messages => updateRows(newRows));
    });
}, refreshTime);

module.exports = { createCron, updateRows };
