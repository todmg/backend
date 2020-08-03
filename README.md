<img src="./assets/images/crown.png" align="right">

# 👑 CROWN by [scyrescyre](https://twitter.com/scyrescyre) & [xshagia](https://twitter.com/xshagia)

## Made for [todmg](https://todmg.club)

👑 is the API behind the new [todmg.club](https://todmg.club) website and is used for showing the Artists, Releases, Interviews from Artists managed by [todmg](https://todmg.club).

# 📦 Installation and Running

## Requirements:

- Node v14.4.0 or later
- RethinkDB
- Your own [Elixire](https://gitlab.com/elixire/elixire) Instance
- Server running Debian 10

## Optional:

- Telegram Bot and Channel
- Discord Webhooks

## ⚙ Rethink Setup

For `utils/database.js` to work properly, you need 5 Tables:

- `artists`
- `interviews`
- `releases`
- `settings`
- `users`

```bash

git clone https://github.com/todmg/crown
cd crown

# Edit config.js to make it work with your setup
nano config.js

# Install dependencies
npm i


# Depending on if you want to run it in prod or dev mode
# use
npm run prod
# or
npm run dev
```

## ⚙ Domain Setup

👑 generally runs on it's own subdomain i.e. `crown.todmg.club` and was not tested to be ran like `todmg.club/crown`, it may be possible to mount it like that but there's no guaranties from us that it will work.
