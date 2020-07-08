const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");

const app = express();
const port = 42069;
console.log("Starting THRIVE OR DIE Backend API...");

// ! Middleware Stuff
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

// Handle 404
app.use(function (req, res) {
  res.status(404).json({ success: false, error: "There is nothing here." });
});

// ! the important bits

app.listen(port, () =>
  console.log(`${chalk.blue("[ SERVER ]")} Running on %s`, port)
);
