import db from "../db.config";import { v4 as uuidv4 } from "uuid";
const getUserUsername = (userId: string) => {
  const query = `
   SELECT id, username
   FROM users
   WHERE users.id = $1
   AND deleted = false;
  `;
  return db.query(query, [userId]).then((data) => data.rows[0]);
};

const createCredUser = (email: string, username: string, hash: string) => {
  const id = uuidv4();
  const query = `
  INSERT INTO users (id, username, email, hashed_password)
  VALUES 
  ($1, $2, $3, $4)
  RETURNING id, username, email
  `;
  return db
    .query(query, [id, username, email, hash])
    .then((data) => data.rows[0]);
};

const createExternalUser = (id: string, email: string, name: string) => {
  const query = `
  INSERT INTO users (id, username, email)
  VALUES 
  ($1, $2, $3)
  RETURNING id, username, email
  `;
  return db.query(query, [id, name, email]).then((data) => data.rows[0]);
};

const getUserByEmail = (email: string) => {
  const query = `
   SELECT *
   FROM users
   WHERE email = $1
   AND deleted = false;
  `;
  return db.query(query, [email]).then((data) => data.rows[0]);
};

module.exports = {
  getUserUsername,
  createCredUser,
  createExternalUser,
  getUserByEmail,
};
