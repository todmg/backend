import {
  Config,
  dbConfig,
  Artist,
  ArtistReponse,
  Release,
  ReleaseReponse,
  DefaultResponse,
  AllArtists,
  AllReleases,
  User,
  CreatedUser,
} from "./interfaces";
import * as gen from "./generators";
import { ArtistValidation, ReleaseValidation } from "./validate";
import r from "rethinkdb";
import chalk from "chalk";
import * as bc from "bcrypt";

let prod = globalThis.args.prod || globalThis.conf.prod || false;
let Artists: any, Interviews: any, Releases: any, Users: any;
if (typeof prod != "boolean")
  throw new Error(
    "Variable prod has to be a boolean.\nPass either --prod (or --prod false) or edit your config.js"
  );

console.log(
  `Running ${chalk.yellow("CROWN")} in ${
    prod ? `${chalk.red("Production")}` : `${chalk.blue("Development")}`
  } Mode`
);

class Database {
  #connection: any;
  #bitch = {
    parts: 5,
    length: 5,
    separator: ":",
  };
  config: dbConfig;
  constructor(config: Partial<dbConfig>) {
    if (!config) config = this.config;
    if (!config.apikey) config.apikey = this.#bitch;
    this.config = {
      dbs: config.dbs || ["crown_dev", "crown"],
      url: config.url || "db.example.com",
      port: config.port || 28015,
      apikey: {
        parts: config.apikey.parts || 5,
        length: config.apikey.length || 5,
        separator: config.apikey.separator || ":",
      },
    };
    r.connect(
      { host: this.config.url, port: this.config.port },
      (err, conn) => {
        if (err) throw err;
        this.#connection = conn;
        console.log(`${chalk.green(`[ DATABASE ]`)} Connected`);
      }
    );

    let db = r.db(prod ? this.config.dbs[1] : this.config.dbs[0]);
    Artists = db.table("artists");
    Interviews = db.table("interviews");
    Releases = db.table("releases");
    Users = db.table("users");
  } // End of Constructor

  async addArtist(body: Artist): Promise<ArtistReponse> {
    try {
      let { value: Artist, error } = await ArtistValidation(body);
      if (error) throw error;
      let artistsArray = await (
        await Artists.filter({ link: Artist.link }).run(this.#connection)
      ).toArray();
      console.log(artistsArray);
      if (artistsArray.length > 0)
        throw new Error("An Artist with this Link already exists.");

      let ArtistDB = await Artists.insert(Artist).run(this.#connection);

      return {
        success: true,
        data: body,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
  async addRelease(body: Release): Promise<ReleaseReponse> {
    try {
      let { value: Release, error } = await ReleaseValidation(body);
      if (error) throw error;

      let releaseArray = await (
        await Releases.filter({ internal: Release.internal }).run(
          this.#connection
        )
      ).toArray();

      // ! Check if Release is already in DB
      if (releaseArray.length > 0)
        throw new Error("A Release with this Internal Name already exists.");

      // ! Add Release to DB
      let ReleaseDB = await Releases.insert(Release).run(this.#connection);

      // ! Add Internal name to each Artist's Profile
      Release.artists.forEach(async (Artist) => {
        let Profile = await Artists.filter({ link: Artist })
          .update(
            { releases: r.row("releases").append(Release.internal) },
            { returnChanges: true }
          )
          .run(this.#connection);
      });

      return { success: true, data: body };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async removeArtist(link: string): Promise<DefaultResponse> {
    try {
      if (!link) throw new Error("No Artist Link was given");
      let artistArray = await (
        await Artists.filter({ link }).run(this.#connection)
      ).toArray();

      if (artistArray.length === 0)
        throw new Error("No Artist with that /link in Database");
      let Artist = artistArray.filter((A) => A.link === link)[0];
      //  return Artist.link;

      let removed = await Artists.filter({ link: Artist.link })
        .delete({ returnChanges: true })
        .run(this.#connection);

      return {
        success: true,
        msg: `${link} has been removed${
          globalThis.conf.companyName
            ? ` from ${globalThis.conf.companyName}`
            : "."
        }`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async removeRelease(internal: string): Promise<DefaultResponse> {
    try {
      if (!internal) throw new Error("No Internal Release Name specified.");
      let ReleaseInDB = await Releases.filter({ internal }).run(
        this.#connection
      );
      let ReleaseArray = await ReleaseInDB.toArray();
      if (ReleaseArray.length === 0)
        throw new Error("No Release with that that internal name in Database");
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
          .run(this.#connection);
      });

      let RemovedRelease = await Releases.filter({
        internal,
      })
        .delete()
        .run(this.#connection);

      return {
        success: true,
        msg: `${internal} has been removed${
          globalThis.conf.companyName
            ? ` from ${globalThis.conf.companyName}`
            : "."
        }`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getArtist(link: string): Promise<ArtistReponse> {
    try {
      let ArtistDB = await Artists.filter({ link }).run(this.#connection);
      let artistsArray = await ArtistDB.toArray();
      let Artist: Artist = artistsArray[0];
      if (!Artist)
        return {
          success: false,
          error: `${link} does not exist in our Database`,
        };
      return {
        success: true,
        data: Artist,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getRelease(internal: string): Promise<ReleaseReponse> {
    try {
      let ReleaseDB = await Releases.filter({ internal }).run(this.#connection);
      let ReleaseArray = await ReleaseDB.toArray();
      let Release: Release = ReleaseArray[0];
      if (!Release)
        return {
          success: false,
          error: `${internal} does not exist in our Database`,
        };
      return {
        success: true,
        data: Release,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getAllArtists(): Promise<AllArtists> {
    try {
      let ArtistDB = await Artists.run(this.#connection);
      let ArtistArray: Artist[] = await ArtistDB.toArray();
      return { success: true, data: ArtistArray };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllReleases(): Promise<AllReleases> {
    try {
      let ReleaseDB = await Releases.run(this.#connection);
      let ReleaseArray: Release[] = await ReleaseDB.toArray();
      return { success: true, data: ReleaseArray };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createUser(user: User): Promise<CreatedUser> {
    console.log(user);
    let { username, password } = user;
    let hashed = bc.hash(user.password, 10);
    return user;
  }
} // End of Class

export default Database;
