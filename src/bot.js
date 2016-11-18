const Telegraf = require('telegraf');
const config = require('./config');
const debugMiddleware = require('./middlewares/debug');
const logMiddleware = require('telegraf-logfile');
const userStatusMiddleware = require('./middlewares/userStatus');
const termsOfService = require('./middlewares/tos');
const adminMiddleware = require('./middlewares/admin');
const userMiddleware = require('./middlewares/user');
const signupCommand = require('./commands/signup');
const commands = require('./commands');
const actions = require('./actions');
const createCron = require('./cron');

const bot = new Telegraf(config.telegram.token);
// session in memory (ctx.session)
bot.use(Telegraf.memorySession());
// output debug logs to the screen
bot.use(debugMiddleware);
// log all telegram updates to a log file
bot.use(logMiddleware(config.log));
// add flags to check if the user has admin privileges to the state
bot.use(adminMiddleware);
// add a displayName property to the state
// build from first/last/username when available
bot.use(userMiddleware);
// userStatus middleware that always checks if the messaging comes
// from an approved / unapproved / new user
bot.use(userStatusMiddleware);
// check if the user has accepted the terms and if not, present it to her
bot.use(termsOfService);
// setup all /commandName commands see src/commands/index.js
Object.keys(commands).forEach(name => {
    bot.command(name, ...commands[name]);
});
// setup all calback handlers
Object.keys(actions).forEach(name => {
    bot.action(new RegExp(`(${name}) *(.*)`), Telegraf.compose(actions[name]));
});
// text input handler
// used mostly to fill forms
bot.on('text', (ctx, next) => {
    const { update, updateType } = ctx;
    if (updateType !== 'message') {
        return next();
    }
    const { text, entities } = update.message;
    if (entities && entities[0].type === 'bot_command') {
        return next();
    }
    const awaitingInput = ctx.session.awaitingInput;
    if (awaitingInput) {
        switch (awaitingInput) {
        case 'signup':
            ctx.session.answers.push(text);
            return Telegraf.compose(signupCommand)(ctx, next);
        case 'schoolForm':
            ctx.session.schoolAnswers.push(text);
            return Telegraf.compose(actions.schoolForm)(ctx, next);
        case 'editAnswer':
            ctx.session.answers[ctx.session.answerToEdit] = text;
            return Telegraf.compose(actions.reviewUserForm)(ctx, next);
        case 'editSchoolAnswer':
            ctx.session.schoolAnswers[ctx.session.answerToEdit] = text;
            return Telegraf.compose(actions.reviewSchoolForm)(ctx, next);
        default:
            return next();
        }
    }
    return next();
});
// TODO get webhooks to work on heroku
bot.telegram.removeWebHook().then(() => {
    bot.startPolling();
    console.log('Bot started in polling mode');
    // start cron job
    createCron(bot, config.cron.interval * 60 * 1000);
}).catch(console.error);

