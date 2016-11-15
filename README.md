Work in progress
----------------

- [ ] Main menu
    - [ ] /indicar command for approved users
    - [ ] /status command for approved users
- Other tasks / pieces
- [ ] better docs on how to setup a google console app
- [ ] help command


Other notes / tasks / whishlist
-------------------------------
- [x] give user typing feedback when loading data
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

Deploying to Heroku
-------------------

After testing your bot locally, you can deploy it to heroku using the heroku
cli and a local secret branch that don't gitignore your config.toml file.

Here is how to make this:

1. Login to heroku using the cli:

```
heroku login
```

2. Go to heroku.com and create a new app

3. Update your config.toml file to include your heroku app url under the
[webkook] section

4. Setup a git remote named heroku to be your production remote:

```
heroku git:remote -a your-heroku-app-name
```

5. Create a local branch that includes your secrets:

```
git checkout -b secret-branch
git branch --set-upstream-to heroku/master
```

6. On your secret local branch, remove config.toml from the .gitignore file
and push this local branch to heroku

```
git checkout secret-branch
$EDITOR .gitignore
git add .
git status
git commit -m "exposing my secrets to heroku"
git push
```

7. Launch your bot and follow the debug logs

```
heroku ps:scale worker=1
heroku logs --tail
```

8. Stop bot

```
heroku ps:scale worker=0
```

9. Change back to your local dev branch copying config.toml
from the secret heroku branch

```
git checkout master
git checkout secret-branch config.toml
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

