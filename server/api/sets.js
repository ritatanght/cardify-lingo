const router = require("express").Router();
const sets = require("../db/queries/sets");
const cards = require("../db/queries/cards");

router.post("/create", (req, res) => {
  // make sure the user is logged-in
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Please log in first." });

  const {
    setFormData: { title, description, category_id },
    cardFormData,
  } = req.body;

  if (!title || !description)
    return res
      .status(400)
      .json({ message: "Title and description cannot be empty" });

  if (!category_id)
    return res.status(400).json({ message: "Please pick a category" });

  if (cardFormData.length === 0)
    return res
      .status(400)
      .json({ message: "There should be at least one card" });

  const emptyCard = cardFormData.some((card) => !card.front || !card.back);
  if (emptyCard)
    return res.status(400).json({ message: "Cards cannot be empty" });

  sets
    .postSetData({ ...req.body.setFormData, user_id: userId })
    .then((data) => {
      // get the id returned from creating the set to create the cards
      const setId = data.id;
      const cardDataWithSetId = cardFormData.map((card) => ({
        ...card,
        setId,
      }));

      cards
        .postCardsData(cardDataWithSetId)
        .then(() => {
          return res.status(201).json({
            message: "Set created successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).end();
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end();
    });
});

router.put("/edit/:id", (req, res) => {
  const setId = req.params.id;

  const userId = req.session.userId;
  // make sure the user is logged-in
  if (!userId) return res.status(401).json({ message: "Please log in first." });

  const {
    setFormData: { title, description, category_id },
    cardFormData,
  } = req.body;

  if (!title || !description)
    return res
      .status(400)
      .json({ message: "Title and description cannot be empty" });

  if (!category_id)
    return res.status(400).json({ message: "Please pick a category" });

  if (cardFormData.length === 0)
    return res
      .status(400)
      .json({ message: "There should be at least one card" });

  const emptyCard = cardFormData.some((card) => !card.front || !card.back);
  if (emptyCard)
    return res.status(400).json({ message: "Cards cannot be empty" });

  // make sure the user who edits the set is the set owner
  sets.getSetOwnerBySetId(setId).then((data) => {
    if (data.user_id !== userId)
      return res
        .status(403)
        .json({ message: "You can only edit your own set." });

    if (!data) return res.status(404).json({ message: "Set not found." });

    // update the set and cards
    const updateSetPromise = sets.updateSetData({ ...req.body.setFormData });
    const updateCardsPromise = cards.updateCardsData(
      cardFormData.map((card) => (card.id ? card : { ...card, set_id: setId })) // add set_id key to new cards
    );

    Promise.all([updateSetPromise, updateCardsPromise])
      .then(() => res.status(200).json({ message: "Set updated successfully" }))
      .catch((err) => {
        console.error(err);
        return res.status(500).end();
      });
  });
});

router.delete("/delete/:id", (req, res) => {
  const setId = req.params.id;

  const userId = req.session.userId;
  // make sure the user is logged-in
  if (!userId) return res.status(401).json({ message: "Please log in first." });

  // make sure the user who deletes the set is the set owner
  sets.getSetOwnerBySetId(setId).then((data) => {
    if (data.user_id !== userId)
      return res
        .status(403)
        .json({ message: "You can only delete your own set." });

    // set the set as deleted in the database
    sets
      .setSetToDeleted(setId)
      .then(() => {
        return res.status(200).json({ message: "Set deleted" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).end();
      });
  });
});

// Get the sets created by the current user in profile page
router.get("/user", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Please log in first." });

  sets
    .getSetsByUserId(userId)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end();
    });
});

// Get the sets and cards for ViewSets and EditSet
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const setPromise = sets.getSetInfoById(id);
  const cardsPromise = cards.getCardsBySetId(id);

  Promise.all([setPromise, cardsPromise])
    .then(([set, cards]) => {
      if (!set) return res.status(404).json({ message: "Set not found" });
      return res.json({ set, cards });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
