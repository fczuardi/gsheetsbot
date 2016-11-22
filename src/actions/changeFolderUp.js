const Telegraf = require('telegraf');
const changeFolder = require('./changeFolder');

const changeState = (ctx, next) => {
    ctx.state.navigatingUp = true;
    next();
};

module.exports = [ changeState, Telegraf.compose(changeFolder) ];

