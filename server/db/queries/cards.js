const db = require("../../configs/db.config");

const postCardsData = (cardsData) => {
  const promises = cardsData.map((cardData) => {
    const query = `
      INSERT INTO lang_cards(front, back, lang_set_id)
      VALUES($1, $2, $3)
    `;
    return db.query(query, [cardData.front, cardData.back, cardData.setId]);
  });
  return Promise.all(promises);
};

const updateCardsData = (cardsData) => {
  const promises = cardsData.map((cardData) => {
    if (cardData.id) {
      const query = `
      UPDATE lang_cards
      SET front = $1,
      back = $2,
      deleted = $3
      WHERE id = $4;
      `;
      return db.query(query, [
        cardData.front,
        cardData.back,
        cardData.deleted,
        cardData.id,
      ]);
    } else {
      const query = `
      INSERT INTO lang_cards (front, back, lang_set_id)
      VALUES ($1, $2, $3)
      RETURNING id;
      `;
      return db.query(query, [cardData.front, cardData.back, cardData.set_id]);
    }
  });

  return Promise.all(promises);
};

const getCardsBySetId = (setId) => {
  return db
    .query(
      `
      SELECT * FROM lang_cards
      WHERE lang_set_id = $1 
      AND deleted = false
      ORDER BY lang_cards.id;`,
      [setId]
    )
    .then((data) => data.rows);
};

const updateCardById = (id, cardData) => {
  const query = `
    UPDATE lang_cards
    SET front = $1, back = $2
    WHERE id = $3
  `;
  return db.query(query, [cardData.front, cardData.back, id]);
};

const getCardOwnerByCardId = (cardId) => {
  return db
    .query(
      `
      SELECT user_id
      FROM lang_sets
      JOIN lang_cards ON lang_sets.id = lang_set_id
      WHERE lang_cards.id = $1;`,
      [cardId]
    )
    .then((data) => data.rows[0]);
};

module.exports = {
  postCardsData,
  updateCardsData,
  getCardsBySetId,
  updateCardById,
  getCardOwnerByCardId,
};
