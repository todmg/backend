const ch = require("chalk");
const r = require("rethinkdb");
const validate = require("./validate");
const config = require("../config");
let DATABASE_CONN;
r.connect({ host: "db.hokkqi.services", port: 28015 }, function (err, conn) {
  if (err) throw err;
  //console.log(conn);
  DATABASE_CONN = conn;
  console.log(`${ch.green(`[ DATABASE Util ]`)} Connected`);
});

//console.log(config.dev ? "todmg_dev" : "todmg");
let db = r.db(config.dev ? "todmg_dev" : "todmg");
let { Artists, Interviews, Releases } = {
  Artists: db.table("artists"),
  Interviews: db.table("interviews"),
  Releases: db.table("releases"),
};

async function add_artist(body) {
  try {
    let { value: Artist, error } = validate.Artist(body);
    if (error) throw new Error(error);
    let artistsArray = await (
      await Artists.filter({ name: Artist.name }).run(DATABASE_CONN)
    ).toArray();

    // ! Check if Artist is already in DB
    if (artistsArray.length > 0)
      throw new Error("An Artist with this Name already exists.");

    // ! Add Artist to DB
    let ArtistDB = await Artists.insert(Artist).run(DATABASE_CONN);

    return ArtistDB;
  } catch (error) {
    throw new Error(error.message);
  }
}
async function add_release(body) {
  try {
    let { value: Artist, error } = validate.Artist(body);
    if (error) throw new Error(error);
    let artistsArray = await (
      await Artists.filter({ name: Artist.name }).run(DATABASE_CONN)
    ).toArray();

    // ! Check if Artist is already in DB
    if (artistsArray.length > 0)
      throw new Error("A Release with this Name already exists.");

    // ! Add Artist to DB
    let ArtistDB = await Artists.insert(Artist).run(DATABASE_CONN);

    return ArtistDB;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  add: {
    Artist: add_artist,
    Release: add_release,
  },
};
