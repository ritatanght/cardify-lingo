import { CardFormData } from "@/types/definitions";
import db from "../db.config";

export const postCardsData = (cardsData: CardFormData[]) => {
  const promises = cardsData.map((cardData) => {
    const query = `
      INSERT INTO lang_cards(front, back, image_url, lang_set_id)
      VALUES($1, $2, $3, $4)
    `;
    return db.query(query, [
      cardData.front,
      cardData.back,
      cardData.image_url,
      cardData.set_id,
    ]);
  });
  return Promise.all(promises);
};

export const updateCardsData = (cardsData: CardFormData[]) => {
  const promises = cardsData.map((cardData) => {
    if (cardData.id) {
      const query = `
      UPDATE lang_cards
      SET front = $1,
      back = $2,
      image_url = $3,
      deleted = $4
      WHERE id = $5;
      `;
      return db.query(query, [
        cardData.front,
        cardData.back,
        cardData.image_url,
        cardData.deleted,
        cardData.id,
      ]);
    } else {
      const query = `
      INSERT INTO lang_cards (front, back, image_url, lang_set_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
      `;
      return db.query(query, [
        cardData.front,
        cardData.back,
        cardData.image_url,
        cardData.set_id,
      ]);
    }
  });

  return Promise.all(promises);
};

export const getCardsBySetId = (setId: string) => {
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

export const updateCardById = (id: string, cardData: CardFormData) => {
  const query = `
    UPDATE lang_cards
    SET front = $1, back = $2, image_url = $3
    WHERE id = $4
  `;
  return db.query(query, [
    cardData.front,
    cardData.back,
    cardData.image_url,
    id,
  ]);
};

export const getCardOwnerByCardId = (cardId: string) => {
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
