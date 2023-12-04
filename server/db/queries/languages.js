const db = require("../../configs/db.config");

const getAllLanguages = () => {
  return db
    .query(
      `
      SELECT * FROM languages
      WHERE deleted = false;`
    )
    .then((data) => data.rows);
};

const getLanguagesById = (categoryId) => {
  return db
    .query(
      `
      SELECT * FROM languages
      WHERE deleted = false 
      AND id = $1;`,
      [categoryId]
    )
    .then((data) => data.rows[0]);
};

module.exports = { getAllLanguages, getLanguagesById };
