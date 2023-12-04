const db = require("../../configs/db.config");

const getAllCategories = () => {
  return db
    .query(
      `
      SELECT * FROM categories
      WHERE deleted = false;`
    )
    .then((data) => data.rows);
};

const getCategoryById = (categoryId) => {
  return db
    .query(
      `
      SELECT * FROM categories
      WHERE deleted = false 
      AND id = $1;`,
      [categoryId]
    )
    .then((data) => data.rows[0]);
};

module.exports = { getAllCategories, getCategoryById };
