const db = require("../../configs/db.config");

const postCardsData = (cardsData) => {
  const promises = cardsData.map((cardData) => {
    const query = `
      INSERT INTO cards(front, back, set_id)
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
      UPDATE cards
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
      INSERT INTO cards (front, back, set_id)
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
      SELECT * FROM cards
      WHERE set_id = $1 
      AND deleted = false
      ORDER BY cards.id;`,
      [setId]
    )
    .then((data) => data.rows);
};

const updateCardById = (id, cardData) => {
  const query = `
    UPDATE cards
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
      FROM sets
      JOIN cards ON sets.id = set_id
      WHERE cards.id = $1;`,
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
