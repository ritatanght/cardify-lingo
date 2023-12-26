import { CardFormData } from "@/types/definitions";
import db from "../db.config";
export const postCardsData = (cardsData: CardFormData[]) => {
  const promises = cardsData.map((cardData) => {
    const query = `
      INSERT INTO lang_cards(front, back, image_url, lang_set_id, sequence)
      VALUES($1, $2, $3, $4, $5)
    `;
    return db.query(query, [
      cardData.front,
      cardData.back,
      cardData.image_url,
      cardData.set_id,
      cardData.sequence,
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
      deleted = $4,
      sequence = $5
      WHERE id = $6;
      `;
      return db.query(query, [
        cardData.front,
        cardData.back,
        cardData.image_url,
        cardData.deleted || false,
        cardData.sequence,
        cardData.id,
      ]);
    } else {
      const query = `
      INSERT INTO lang_cards (front, back, image_url, lang_set_id, sequence)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
      `;
      return db.query(query, [
        cardData.front,
        cardData.back,
        cardData.image_url,
        cardData.set_id,
        cardData.sequence,
      ]);
    }
  });

  return Promise.all(promises);
};

export const getCardsBySetId = (setId: string) => {
  return db
    .query(
      `
      SELECT id, front, back, image_url FROM lang_cards
      WHERE lang_set_id = $1 
      AND deleted = false
      ORDER BY sequence;`,
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
