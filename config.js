// If not used by THRIVE OR DIE MANAGEMENT, change these Values
// You're not able to get into our Database, don't worry.

module.exports = {
  companyName: "THRIVE OR DIE", // (Optional) May show up in API Responses.
  prod: false, // Determines if Development or Production DB is used
  port: 42069, // Port on which 👑 is supposed to run
  database: {
    // Example: dCpk2dTE:aaHbS2x6:oWzfN7oo:ywQ0yPGz:3rUzHVuZ
    url: "database.todmg.club", // RethinkDB IP or URL
    port: 28015, // RethinkDB Port ( NOT THE WEBINTERFACE )
    dbs: ["todmg_dev", "todmg"],
    // Used Databases, [0] is the Development Database and [1] is the Production Database
    apikey: {
      parts: 5, // How many parts should be generated?
      length: 5, // How long should each part be?
      separator: ":", // With which character should the parts be sepatated?
    },
    elixire: {
      instance_url: "<Your Instance URL>",
      apikey: "<API Key>",
    },
  },
};
