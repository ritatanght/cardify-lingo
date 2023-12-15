import { Set } from "@/types/definitions";
import db from "../db.config";

export const postSetData = (setData: Set) => {
  const query = `
  INSERT INTO lang_sets (title, description, private, language_id, user_id)
  VALUES ($1, $2, $3, $4, $5) RETURNING id;
  `;
  return db
    .query(query, [
      setData.title,
      setData.description,
      setData.private,
      setData.language_id,
      setData.user_id,
    ])
    .then((data) => data.rows[0]);
};

export const updateSetData = (setData: Set) => {
  const query = `
  UPDATE lang_sets
  SET title = $1,
  description = $2,
  private = $3,
  language_id = $4
  WHERE id = $5
  RETURNING id;
  `; //Must return sets.id. Used for cards set_id field when updating

  return db
    .query(query, [
      setData.title,
      setData.description,
      setData.private,
      setData.language_id,
      setData.id,
    ])
    .then((data) => data.rows[0]);
};

export const getSetsByUserId = (userId: string) => {
  const query = `
    SELECT lang_sets.*
    FROM lang_sets
    JOIN users ON user_id = users.id
    WHERE lang_sets.user_id = $1
    AND lang_sets.deleted = false;
  `;
  return db.query(query, [userId]).then((data) => data.rows);
};

export const getSetInfoById = (setId: string) => {
  return db
    .query(
      `
      SELECT lang_sets.*, languages.name AS language_name, languages.id AS language_id, username
      FROM lang_sets
      JOIN languages ON language_id = languages.id
      JOIN users ON user_id = users.id
      WHERE lang_sets.id = $1
      AND lang_sets.deleted = false;`,
      [setId]
    )
    .then((data) => data.rows[0]);
};

export const getSetsByLanguageId = (languageId: string) => {
  return db
    .query(
      `
    SELECT lang_sets.*, username FROM lang_sets 
    JOIN users ON user_id = users.id
    WHERE language_id = $1
    AND lang_sets.deleted = false
  ;`,
      [languageId]
    )
    .then((data) => data.rows);
};

export const getSetOwnerBySetId = (setId: string) => {
  return db
    .query(
      `
      SELECT user_id
      FROM lang_sets
      WHERE lang_sets.id = $1;`,
      [setId]
    )
    .then((data) => data.rows[0]);
};

export const setSetToDeleted = (setId: string) => {
  const query = `
   UPDATE lang_sets
   SET deleted = true
   WHERE id = $1;
  `;

  return db.query(query, [setId]);
};
