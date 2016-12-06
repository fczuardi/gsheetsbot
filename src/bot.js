const Telegraf = require('telegraf');
const config = require('./config');
const debugMiddleware = require('./middlewares/debug');
const logMiddleware = require('telegraf-logfile');
const groupMiddlewares = require('./middlewares/groups');
const userStatusMiddleware = require('./middlewares/userStatus');
const termsOfService = require('./middlewares/tos');
const adminMiddleware = require('./middlewares/admin');
const userMiddleware = require('./middlewares/user');
const signupCommand = require('./commands/signup');
const supportCommand = require('./commands/contact');
const commands = require('./commands');
const actions = require('./actions');
const { createCron } = require('./cron');

const bot = new Telegraf(config.telegram.token);

// session in memory (ctx.session)
bot.use(Telegraf.memorySession());

// output debug logs to the screen
bot.use(debugMiddleware);

// log all telegram updates to a log file
bot.use(logMiddleware(config.log));

// early exit if the update comes from the a grou but is not one of the
// expected commands or callbacks
bot.use(groupMiddlewares);

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
bot.on('message', (ctx, next) => {
    const { update } = ctx;
    const { text, entities, contact, location } = update.message;
    if (entities && entities[0].type === 'bot_command') {
        return next();
    }
    const { textCommands
        , awaitingInput
        , answerToEdit
    } = ctx.session;

    console.log({ text });
    if (
        textCommands && 
        typeof text === 'string' && 
        Object.keys(textCommands).includes(text.trim())
    ) {
        // console.log('---TEXT COMMAND---');
        const callbackData = textCommands[text];
        // console.log({ callbackData });
        const callbackPattern = new RegExp('([^ ]*) *(.*)');
        const matches = callbackData.match(callbackPattern);
        // console.log({ matches });
        const actionName = matches[1];
        // console.log({ actionName });
        ctx.match = matches;
        return Telegraf.compose(actions[actionName])(ctx, next);
    }

    if (awaitingInput) {
        const phoneNumber = contact ? contact.phone_number : null;
        const latLon = location ? JSON.stringify(location) : null;
        const answerText = text || phoneNumber || latLon;
        switch (awaitingInput) {
        case 'signup':
            ctx.session.answers.push(answerText);
            return Telegraf.compose(signupCommand)(ctx, next);
        case 'schoolForm':
            ctx.session.schoolAnswers.push(answerText);
            return Telegraf.compose(actions.schoolForm)(ctx, next);
        case 'editUserAnswer':
            ctx.session.answers[answerToEdit] = text;
            return Telegraf.compose(actions.reviewUserForm)(ctx, next);
        case 'editSchoolAnswer':
            ctx.session.schoolAnswers[answerToEdit] = text;
            return Telegraf.compose(actions.reviewSchoolForm)(ctx, next);
        case 'support':
            return Telegraf.compose(supportCommand)(ctx, next);
            return next();
        default:
            return next();
        }
    }

    return Telegraf.compose(commands.start)(ctx, next);
});

// TODO get webhooks to work on heroku
bot.telegram.removeWebHook().then(() => {
    bot.startPolling();
    console.log('Bot started in polling mode');
    // start cron job
    createCron(bot, config.cron.interval * 60 * 1000);
}).catch(console.error);

