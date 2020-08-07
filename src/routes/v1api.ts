import express from "express";
const router = express.Router();
import Database from "../utils/database";
import * as pgk from "../../package.json";
import {
  ArtistReponse,
  ReleaseReponse,
  DefaultResponse,
} from "utils/interfaces";
let database = new Database(globalThis.conf.database);

router.get("/", async (req, res) => {
  return res.json({
    name: pgk.name,
    version: pgk.version,
  });
});

router.post(
  "/artist",
  async (req, res): Promise<ArtistReponse> => {
    let newArtist: ArtistReponse = await database.addArtist(req.body);
    let s = newArtist.success ? 200 : 400;

    return res.status(s).jsonp(newArtist);
  }
);
router.post(
  "/release",
  async (req, res): Promise<ReleaseReponse> => {
    let newRelease = await database.addRelease(req.body);

    let s = newRelease.success ? 200 : 400;

    return res.status(s).jsonp(newRelease);
  }
);

router.delete(
  "/artist/:link",
  async (req, res): Promise<DefaultResponse> => {
    let deleted = await database.removeArtist(req.params.link);
    let s = deleted.success ? 200 : 400;

    return res.status(s).jsonp(deleted);
  }
);

router.delete(
  "/release/:internal",
  async (req, res): Promise<DefaultResponse> => {
    let deleted = await database.removeRelease(req.params.internal);
    let s = deleted.success ? 200 : 400;

    return res.status(s).jsonp(deleted);
  }
);

router.get("/all/:kind", async (req, res, next) => {
  let s;
  switch (req.params.kind) {
    case "artists":
      let AllArtists = await database.getAllArtists();
      s = AllArtists.success ? 200 : 400;
      return res.status(s).json(AllArtists);
    case "releases":
      let AllReleases = await database.getAllReleases();
      s = AllReleases.success ? 200 : 400;
      return res.status(s).json(AllReleases);
    default:
      next();
  }
});

router.get("/artist/:link", async (req, res) => {
  let Artist = await database.getArtist(req.params.link);
  let s = Artist.success ? 200 : 400;
  return res.status(s).json(Artist);
});
router.get("/release/:internal", async (req, res) => {
  let Release = await database.getRelease(req.params.internal);
  let s = Release.success ? 200 : 400;
  return res.status(s).json(Release);
});

// router.post("/auth/register", async (req, res) => {
//   let User = await db.auth.register(req.body);
//   let s = User.success ? 200 : 400;
//   return res.status(s).json(User);
// });
// router.post("/auth/apikey", async (req, res) => {
//   let User = await db.auth.apikey(req.body);
//   let s = User.success ? 200 : 400;
//   return res.status(s).json(User);
// });

router.use(function (req, res) {
  res.status(404).json({ success: false, error: "There is nothing here..." });
});
export = router;
