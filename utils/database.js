const ch = require("chalk");
const r = require("rethinkdb");
const validate = require("./validate");
const config = require("../config");
let prod = process.conf.prod || config.prod || false;
console.log(`Running Crown in ${prod ? "Production" : "Development"} Mode`);
if (typeof prod != "boolean")
  throw new Error(
    "Variable prod has to be a boolean.\nPass either --prod (or --prod false) or edit your config.js"
  );

let DATABASE_CONN;
r.connect({ host: config.database_url, port: config.db_port }, function (
  err,
  conn
) {
  if (err) throw err;
  DATABASE_CONN = conn;
  console.log(`${ch.green(`[ DATABASE Util ]`)} Connected`);
});

let db = r.db(config.dev ? config.database[0] : config.database[1]);
let { Artists, Interviews, Releases } = {
  Artists: db.table("artists"),
  Interviews: db.table("interviews"),
  Releases: db.table("releases"),
};

async function add_artist(body) {
  try {
    let { value: Artist, error } = validate.Artist(body);
    if (error) throw new Error(error);
    delete Artist.user;
    let artistsArray = await (
      await Artists.filter({ link: Artist.link }).run(DATABASE_CONN)
    ).toArray();

    // ! Check if Artist is already in DB
    if (artistsArray.length > 0)
      throw new Error("An Artist with this Link already exists.");

    // ! Add Artist to DB
    let ArtistDB = await Artists.insert(Artist).run(DATABASE_CONN);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function add_release(body) {
  try {
    let { value: Release, error } = validate.Release(body);
    if (error) throw new Error(error);
    delete Release.user;
    let releaseArray = await (
      await Releases.filter({ internal: Release.internal }).run(DATABASE_CONN)
    ).toArray();

    // ! Check if Release is already in DB
    if (releaseArray.length > 0)
      throw new Error("A Release with this Internal Name already exists.");

    // ! Add Release to DB
    let ReleaseDB = await Releases.insert(Release).run(DATABASE_CONN);
    // ! Add Internal name to each Artist's Profile
    Release.artists.forEach(async (Artist) => {
      let Profile = await Artists.filter({ link: Artist })
        .update(
          { releases: r.row("releases").append(Release.internal) },
          { returnChanges: true }
        )
        .run(DATABASE_CONN);
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function remove_artist(link) {
  if (!link) throw new Error("No Artist Link was given");
  try {
    let artistsArray = await (
      await Artists.filter({ link }).run(DATABASE_CONN)
    ).toArray();

    // ! Check if there's Artists in the Array
    if (artistsArray.length === 0)
      throw new Error("No Artist with that /link in Database");
    let Artist = artistsArray.filter((A) => A.link === link)[0];
    //  return Artist.link;

    let removed = await Artists.filter({ link: Artist.link })
      .delete({ returnChanges: true })
      .run(DATABASE_CONN);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function remove_release(internal) {
  try {
    if (!internal) throw new Error("No release specified");
    let ReleaseInDB = await Releases.filter({ internal: internal }).run(
      DATABASE_CONN
    );
    let ReleaseArray = await ReleaseInDB.toArray();
    let FoundRelease = ReleaseArray[0];

    FoundRelease.artists.forEach((Artist) => {
      Artists.filter({ link: Artist })
        .update((row) => {
          return {
            releases: row("releases").filter((release) => {
              return release.ne(internal);
            }),
          };
        })
        .run(DATABASE_CONN);
    });

    let RemovedRelease = await Releases.filter({
      internal,
    })
      .delete()
      .run(DATABASE_CONN);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function get_artist(link) {
  try {
    let ArtistDB = await Artists.filter({ link }).run(DATABASE_CONN);
    let artistsArray = await ArtistDB.toArray();
    let Artist = artistsArray[0];
    if (!Artist)
      return {
        success: false,
        error: `${link} does not exist in our Database`,
      };
    return {
      success: true,
      data: {
        link: Artist.link,
        name: Artist.name,
        desc: Artist.desc,
        img: Artist.img,
        releases: Artist.releases,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function get_release(internal) {
  try {
    let ReleaseDB = await Releases.filter({ internal }).run(DATABASE_CONN);
    let releaseArray = await ReleaseDB.toArray();
    let Release = releaseArray[0];
    return {
      data: {
        internal: Release.internal,
        title: Release.title,
        desc: Release.desc,
        artwork: Release.artwork,
        link: Release.link,
        date: Release.date,
        hidden: Release.hidden,
        artists: Release.artists,
      },
      success: true,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function get_allReleases() {
  try {
    let ReleaseDB = await Releases.run(DATABASE_CONN);
    let releaseArray = await ReleaseDB.toArray();
    return { success: true, data: { releases: releaseArray } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function get_allArtists() {
  try {
    let ArtistDB = await Artists.run(DATABASE_CONN);
    let artistArray = await ArtistDB.toArray();
    return { success: true, data: { artists: artistArray } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function register(body) {
  let { value: user, error } = validate.User(body);
  if (error) throw new Error(error);
}

module.exports = {
  add: {
    Artist: add_artist,
    Release: add_release,
  },
  remove: {
    Artist: remove_artist,
    Release: remove_release,
  },
  get: {
    Artist: get_artist,
    Release: get_release,
    AllReleases: get_allReleases,
    AllArtists: get_allArtists,
  },
  auth: {},
};
