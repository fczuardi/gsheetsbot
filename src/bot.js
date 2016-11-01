const Telegraf = require('telegraf');
require('toml-require').install();
const config = require('../config.toml');
const configMiddleware = require('./middlewares/config');
const userMiddleware = require('./middlewares/user');
const commands = require('./commands');

const bot = new Telegraf(config.telegram.token);
bot.use(configMiddleware);
bot.use(userMiddleware);
Object.keys(commands).forEach(commandName => {
    bot.command(commandName, commands[commandName]);
});
bot.startPolling();
