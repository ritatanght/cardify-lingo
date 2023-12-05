const router = require("express").Router();
const searches = require("../db/queries/searches");

router.get("/", (req, res) => {
  searches
    .searchByText(req.query.query)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

module.exports = router;
