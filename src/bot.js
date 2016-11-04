const Telegraf = require('telegraf');
const config = require('./config');
const debugMiddleware = require('./middlewares/debug');
const logMiddleware = require('telegraf-logfile');
const configMiddleware = require('./middlewares/config');
const userMiddleware = require('./middlewares/user');
const commands = require('./commands');

const bot = new Telegraf(config.telegram.token);
bot.use(debugMiddleware);
bot.use(logMiddleware(config.log));
bot.use(configMiddleware);
bot.use(userMiddleware);
Object.keys(commands).forEach(name => {
    bot.command(name, ...commands[name]);
});
bot.startPolling();

