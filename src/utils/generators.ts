import * as Snowflake from "nodejs-snowflake";
const SnowflakeConfig = {
  customEpoch: 1583691660,
  returnNumber: false,
};

function string(L) {
  var s = "";
  var randomchar = function () {
    var n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  };
  while (s.length < L) s += randomchar();
  return s;
}
const Flakes = new Snowflake.UniqueID(SnowflakeConfig);

async function snowflake() {
  return Flakes.getUniqueID();
}

module.exports = { string, snowflake };
