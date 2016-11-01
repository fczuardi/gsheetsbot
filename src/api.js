const util = require('util');
const url = require('url');
const express = require('express');

require('toml-require').install();
const config = require('../config.toml');

const oauthPath = url.parse(config.oauth.redirectUrl).pathname;

const app = express();

app.get(oauthPath, (req, res) => {
    console.log(req);
    return res.send(`req: <pre>${util.inspect(req)}</pre>`);
});

app.listen(config.api.port);

