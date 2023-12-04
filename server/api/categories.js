const router = require("express").Router();
const categories = require("../db/queries/categories");
const sets = require("../db/queries/sets");

router.get("/", (req, res) => {
  categories
    .getAllCategories()
    .then((data) => res.json(data))
    .catch(() =>
      res.status(500).json({ message: "Error fetching categories" })
    );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const categoryPromise = categories.getCategoryById(id);
  const setsPromise = sets.getSetsByCategoryId(id);

  Promise.all([categoryPromise, setsPromise]).then(([category, sets]) => {
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ category: category.name, sets });
  });
});

module.exports = router;
