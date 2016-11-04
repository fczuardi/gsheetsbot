Work in progress
----------------

- [x] launch bot based on botfather credentials
- [x] launch express app to listen http requests such as oauth redirect
- [x] admin command to give bot Google Sheets permissions
- [ ] log all telegram updates on a log file
- [ ] /status command for pending-approval users
  - just reads from a sheet column
- [ ] /signup command for new users
  - [ ] read questions and review button namesfrom one sheetName
  - [ ] answers review step
  - [ ] write answers on a different sheetName
- [ ] /start command for new users
  - [ ] tos acceptance flow
- [ ] help command
- [ ] google drive middleware
- [ ] gdrive folder navigation
- [ ] gdrive use a README.md in the folder root as an intro message


Other notes / tasks / whishlist
-------------------------------
- [ ] give user typing feedback when loading data
- [ ] form validation
- [ ] setup CI

Contributing
------------

### Clone and install dependencies
```shell
git clone https://github.com/fczuardi/gsheetsbot.git
cd gsheetsbot
yarn
```

### Setup

#### Telegram bot with @BotFather
Talk with [BotFather][botfather] to create a Telegram bot and
get a bot api token.

[botfather]: https://core.telegram.org/bots#6-botfather

#### Google App for acessing Google Sheets
Follow step 1 of https://developers.google.com/sheets/quickstart/nodejs

### Launch bot and api processes that restarts on src file changes
```shell
yarn dev
```

### Display stream of logs
```shell
yarn logs
```

### Stop all processes
```shell
yarn stop
```

Dependencies
------------

This bot uses the [Telegraf][telegraf] library for interacting with the
Telegram Bot API.

The configuration file is writem in [TOML][toml], and we use 
[toml-require][toml-require] for parsing it on node.js

To interact with Google APIs we use [googleapis][googleapis].

[telegraf]: http://telegraf.js.org/
[toml]: https://github.com/toml-lang/toml
[toml-require]: https://www.npmjs.com/package/toml-require
[googleapis]: https://github.com/google/google-api-nodejs-client

Dev Dependencies
----------------

Some tools we use in the developer environment:

- [Eslint][eslint] for linting and to enforce
[mnmo code style][eslint-config-mnmo]
- [pm2][pm2] for managing node processess launching/restarting/logging

[eslint]: http://eslint.org/
[eslint-config-mnmo]: https://github.com/mnmo/eslint-config-mnmo
[pm2]: http://pm2.keymetrics.io/

