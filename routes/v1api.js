const router = require("express").Router();
const db = require("../utils/database");
const package = require("../package.json");

router.get("/", async (req, res) => {
  return res.json({
    name: package.name,
    version: package.version,
  });
});

router.post("/artist", async (req, res) => {
  let newArtist = await db.add.Artist(req.body);

  let s = newArtist.success ? 200 : 400;

  return res.status(s).jsonp(newArtist);
});
router.post("/release", async (req, res) => {
  let newRelease = await db.add.Release(req.body);

  let s = newRelease.success ? 200 : 400;

  return res.status(s).jsonp(newRelease);
});

router.delete("/artist/:link", async (req, res) => {
  let deleted = await db.remove.Artist(req.params.link);
  let s = deleted.success ? 200 : 400;

  return res.status(s).jsonp(deleted);
});

router.delete("/release/:internal", async (req, res) => {
  let deleted = await db.remove.Release(req.params.internal);
  let s = deleted.success ? 200 : 400;

  return res.status(s).jsonp(deleted);
});

router.get("/all/:kind", async (req, res) => {
  let s;
  switch (req.params.kind) {
    case "artists":
      let AllArtists = await db.get.AllArtists();
      s = AllArtists.success ? 200 : 400;
      return res.status(s).json(AllArtists);
    case "releases":
      let AllReleases = await db.get.AllReleases();
      s = AllReleases.success ? 200 : 400;
      return res.status(s).json(AllReleases);
    default:
      return res
        .status(404)
        .json({ success: false, error: "There is nothing here..." });
  }
});

router.get("/artist/:link", async (req, res) => {
  let Artist = await db.get.Artist(req.params.link);
  let s = Artist.success ? 200 : 400;
  return res.status(s).json(Artist);
});
router.get("/release/:internal", async (req, res) => {
  let Release = await db.get.Release(req.params.internal);
  let s = Release.success ? 200 : 400;
  return res.status(s).json(Release);
});

module.exports = router;
