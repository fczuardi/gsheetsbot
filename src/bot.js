const Telegraf = require('telegraf');
require('toml-require').install();
const config = require('../config.toml');
const configMiddleware = require('./middlewares/config');
const commands = require('./commands');

const bot = new Telegraf(config.telegram.token);
bot.use(configMiddleware);
Object.keys(commands).forEach(commandName => {
    bot.command(commandName, commands[commandName]);
});
bot.startPolling();
