const db = require("../../configs/db.config");

const getFavoritesByUserId = (userId) => {
  return db
    .query(
      `
    SELECT sets.id, sets.title, sets.private, sets.user_id, users.username AS username
    FROM favorites
    JOIN sets ON favorites.set_id = sets.id
    JOIN users ON sets.user_id = users.id
    WHERE favorites.user_id = $1 
    AND sets.deleted = false
    AND favorites.deleted = false;`,
      [userId]
    )
    .then((data) => data.rows);
};

const addFavoriteByUserAndSet = (userId, setId) => {
  return db.query(
    `SELECT * FROM favorites 
     WHERE user_id = $1
     AND set_id = $2;`,
    [userId, setId]
  ).then((likeRecord) => {
    // update deleted column for a found existing record
    if (likeRecord.rowCount > 0) {
      return db
        .query(
          `UPDATE favorites
           SET deleted = false
           WHERE user_id = $1
           AND set_id = $2;`,
          [userId, setId]
        )
        .then((data) => data.rows);
    } else {
      //insert a row if no record is found
      return db
        .query(
          `INSERT INTO favorites (user_id, set_id)
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
      UPDATE favorites
      SET deleted = true
      WHERE user_id = $1
      AND set_id = $2;`,
      [userId, setId]
    )
    .then((data) => data.rows);
};

module.exports = {
  getFavoritesByUserId,
  addFavoriteByUserAndSet,
  removeFavoriteByUserAndSet,
};
