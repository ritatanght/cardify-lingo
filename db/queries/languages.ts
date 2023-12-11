import db from "../db.config";

const getAllLanguages = () => {
  return db
    .query(
      `
      SELECT * FROM languages
      WHERE deleted = false;`
    )
    .then((data) => data.rows);
};

const getLanguageById = (languageId:string) => {
  return db
    .query(
      `
      SELECT * FROM languages
      WHERE deleted = false 
      AND id = $1;`,
      [languageId]
    )
    .then((data) => data.rows[0]);
};

module.exports = { getAllLanguages, getLanguageById };
