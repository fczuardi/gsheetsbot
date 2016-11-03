const util = require('util');
const url = require('url');
const express = require('express');

const config = require('./config');
const oauth2Client = require('./oauth');

const app = express();

const oauthCallbackPath = url.parse(config.oauth.redirectUrl).pathname;
app.get(oauthCallbackPath, (req, res) => {
    const code = req.query.code;
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.error(err);
            return res.status(500).send(`${util.inspect(err)}`);
        }
        if (!tokens.refresh_token) {
            return res.send(`${util.inspect(tokens)}`);
        }
        return res.send(`
<h4>
    Copy the line below to your config.toml inside the the [oauth] section:
</h4>
<pre>

refreshToken = "${tokens.refresh_token}"

</pre>
        `);
    });
});

app.listen(config.api.port);

