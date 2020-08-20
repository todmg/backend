import express from "express";
import chalk from "chalk";
import morgan from "morgan";
import minimist from "minimist";
import config from "../config.js";
const args = minimist(process.argv.slice(2));
globalThis.args = args;
globalThis.conf = config;

const app = express();
const port = args.port || config.port || 42069;

console.log(`Starting ${chalk.yellow("CROWN")}...`);

app.use("/assets", express.static("./assets"));
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.hex("#34ace0").bold(`[ ${tokens.method(req, res)} ]`),
      chalk.hex("#ffb142").bold(tokens.status(req, res)),
      chalk.hex("#ff5252").bold(req.hostname + tokens.url(req, res)),
      chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + "ms"),
      chalk.hex("#f78fb3").bold("@ " + tokens.date(req, res)),
    ].join(" ");
  })
);

app.use(express.json());

const apiv1 = require("./routes/v1api");
app.use("/api/v1", apiv1);
const home = require("./routes/home");
app.use("/", home);

// Handle 404
app.use(function (req, res) {
  res.status(404).json({ success: false, error: "There is nothing here..." });
});

// ! the important bits

app.listen(port, () =>
  console.log(`${chalk.blue("[ SERVER ]")} Running on %s`, port)
);
