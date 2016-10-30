require('toml-require').install();
const config = require('./config.toml');
const Telegraf = require('telegraf');
console.log(config);
console.log(Telegraf);
