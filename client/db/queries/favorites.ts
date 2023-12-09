import db from "../db.config";

const getFavoritesByUserId = (userId) => {
  return db
    .query(
      `
    SELECT lang_sets.id, lang_sets.title, lang_sets.private, lang_sets.user_id, users.username AS username
    FROM lang_favorites
    JOIN lang_sets ON lang_favorites.lang_set_id = lang_sets.id
    JOIN users ON lang_sets.user_id = users.id
    WHERE lang_favorites.user_id = $1 
    AND lang_sets.deleted = false
    AND lang_favorites.deleted = false;`,
      [userId]
    )
    .then((data) => data.rows);
};

const addFavoriteByUserAndSet = (userId, setId) => {
  return db
    .query(
      `SELECT * FROM lang_favorites 
     WHERE user_id = $1
     AND lang_set_id = $2;`,
      [userId, setId]
    )
    .then((likeRecord) => {
      // update deleted column for a found existing record
      if (likeRecord.rowCount > 0) {
        return db
          .query(
            `UPDATE lang_favorites
           SET deleted = false
           WHERE user_id = $1
           AND lang_set_id = $2;`,
            [userId, setId]
          )
          .then((data) => data.rows);
      } else {
        //insert a row if no record is found
        return db
          .query(
            `INSERT INTO lang_favorites (user_id, lang_set_id)
           VALUES ($1, $2);`,
            [userId, setId]
          )
          .then((data) => data.rows);
      }
    });
};

const removeFavoriteByUserAndSet = (userId, setId) => {
  return db
    .query(
      `
      UPDATE lang_favorites
      SET deleted = true
      WHERE user_id = $1
      AND lang_set_id = $2;`,
      [userId, setId]
    )
    .then((data) => data.rows);
};

module.exports = {
  getFavoritesByUserId,
  addFavoriteByUserAndSet,
  removeFavoriteByUserAndSet,
};
