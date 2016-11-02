const Telegraf = require('telegraf');
require('toml-require').install();
const config = require('../config.toml');
const debugMiddleware = require('./middlewares/debug');
const configMiddleware = require('./middlewares/config');
const userMiddleware = require('./middlewares/user');
const commands = require('./commands');

const bot = new Telegraf(config.telegram.token);
bot.use(debugMiddleware);
bot.use(configMiddleware);
bot.use(userMiddleware);
Object.keys(commands).forEach(name => {
    bot.command(name, ...commands[name]);
});
bot.startPolling();

