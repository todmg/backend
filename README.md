<img src="./assets/images/crown.png" align="right">

# 👑 CROWN by [scyrescyre](https://werewolf.computer) & [xshagia](https://twitter.com/xshagia)

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
- `interviews` ( Optional )
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


# Run it
npm run dev # run this first to check if everything works as intended

npm run prod # make the code use production variables
```
