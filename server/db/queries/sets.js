const db = require("../../configs/db.config");

const postSetData = (setData) => {
  const query = `
  INSERT INTO sets (title, description, private, category_id, user_id)
  VALUES ($1, $2, $3, $4, $5) RETURNING id;
  `;
  return db
    .query(query, [
      setData.title,
      setData.description,
      setData.private,
      setData.category_id,
      setData.user_id,
    ])
    .then((data) => data.rows[0]);
};

const updateSetData = (setData) => {
  const query = `
  UPDATE sets
  SET title = $1,
  description = $2,
  private = $3,
  category_id = $4
  WHERE id = $5
  RETURNING id;
  `; //Must return sets.id. Used for cards set_id field when updating

  return db
    .query(query, [
      setData.title,
      setData.description,
      setData.private,
      setData.category_id,
      setData.set_id,
    ])
    .then((data) => data.rows[0]);
};

const getSetsByUserId = (userId) => {
  const query = `
    SELECT sets.*
    FROM sets
    JOIN users ON user_id = users.id
    WHERE sets.user_id = $1
    AND sets.deleted = false;
  `;
  return db.query(query, [userId]).then((data) => data.rows);
};

const getSetInfoById = (setId) => {
  return db
    .query(
      `
      SELECT sets.*, categories.name AS category_name, categories.id AS category_id, username
      FROM sets
      JOIN categories ON category_id = categories.id
      JOIN users ON user_id = users.id
      WHERE sets.id = $1
      AND sets.deleted = false;`,
      [setId]
    )
    .then((data) => data.rows[0]);
};

const getSetsByCategoryId = (categoryId) => {
  return db
    .query(
      `
    SELECT sets.*, username FROM sets 
    JOIN users ON user_id = users.id
    WHERE category_id = $1
    AND sets.deleted = false
  ;`,
      [categoryId]
    )
    .then((data) => data.rows);
};

const getSetOwnerBySetId = (setId) => {
  return db
    .query(
      `
      SELECT user_id
      FROM sets
      WHERE sets.id = $1;`,
      [setId]
    )
    .then((data) => data.rows[0]);
};

const setSetToDeleted = (setId) => {
  const query = `
   UPDATE sets
   SET deleted = true
   WHERE id = $1;
  `;

  return db.query(query, [setId]);
};

module.exports = {
  postSetData,
  updateSetData,
  getSetsByUserId,
  getSetInfoById,
  getSetsByCategoryId,
  getSetOwnerBySetId,
  setSetToDeleted,
};
