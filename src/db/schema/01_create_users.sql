DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255),
  deleted BOOLEAN DEFAULT false
);