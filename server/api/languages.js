const router = require("express").Router();
const languages = require("../db/queries/languages");
const sets = require("../db/queries/sets");

router.get("/", (req, res) => {
  languages
    .getAllLanguages()
    .then((data) => res.json(data))
    .catch(() => res.status(500).json({ message: "Error fetching languages" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const languagePromise = languages.getLanguageById(id);
  const setsPromise = sets.getSetsByLanguageId(id);

  Promise.all([languagePromise, setsPromise]).then(([language, sets]) => {
    if (!language)
      return res.status(404).json({ message: "Language not found" });
    res.json({ language: language.name, sets });
  });
});

module.exports = router;
