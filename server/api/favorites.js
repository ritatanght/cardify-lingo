const express = require("express");
const router = express.Router();
const favorites = require("../db/queries/favorites");

router.get("/", (req, res) => {
  const userId = req.session.userId;
  if (!userId)
    return res.status(401).json({ message: "Login to view favorite sets" });

  favorites
    .getFavoritesByUserId(userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:setId", (req, res) => {
  const { setId } = req.params;
  const userId = req.session.userId;
  if (!userId)
    return res.status(401).json({ message: "Login to favorite set" });

  favorites
    .addFavoriteByUserAndSet(userId, setId)
    .then(() => res.status(201).end())
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:setId", (req, res) => {
  const { setId } = req.params;
  const userId = req.session.userId;
  if (!userId)
    return res
      .status(401)
      .json({ message: "Login to make changes to favorite set." });

  favorites
    .removeFavoriteByUserAndSet(userId, setId)
    .then(() => res.status(200).end())
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
