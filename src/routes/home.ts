import express from "express";
const router = express.Router();
import database from "../utils/init";

router.get("/", (req, res) => {
  res.json({ msg: "henlo" });
});

router.post("/register", async (req, res) => {
  let User = await database.createUser(req.body);
  // let s = User.success ? 200 : 400;
  return res.json(User);
});

export = router;
