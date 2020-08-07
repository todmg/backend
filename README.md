<img src="./assets/images/crown.png" align="right">

# 👑 CROWN by [scyrescyre](https://twitter.com/scyrescyre) & [xshagia](https://twitter.com/xshagia)

## Made for [todmg]

👑 is the API behind the new [todmg.club][todmg] website and is used for showing the Artists, Releases, Interviews from Artists managed by [todmg].

# 📦 Installation and Running

## Requirements:

- Node v14.4.0 or later
- RethinkDB
- Your own [Elixire] Instance
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

# Build the API
npm run build
```

## ⚙ Domain Setup

👑 generally runs on it's own subdomain i.e. `crown.todmg.club` and was not tested to be ran like `todmg.club/crown`, it may be possible to mount it like that but there's no guaranties from us that it will work.

[todmg]: https://todmg.club
[elixire]: https://gitlab.com/elixire/elixire
