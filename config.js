// If not used by THRIVE OR DIE MANAGEMENT, change these Values
// You're not able to get into our Database, don't worry.

module.exports = {
  prod: false, // Determines if Development DB or Production DB is used
  database_url: "db.hokkqi.services", // RethinkDB IP or URL
  db_port: 28015, // RethinkDB Port ( NOT THE WEBINTERFACE )
  database: ["todmg_dev", "todmg"],
  // Used Databases, [0] is the Development Database and [1] is the Production Database
};
