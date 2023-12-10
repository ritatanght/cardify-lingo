DROP TABLE IF EXISTS lang_sets CASCADE;

CREATE TABLE lang_sets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  private BOOLEAN default false,
  language_id INT REFERENCES languages(id),
  user_id VARCHAR(255) REFERENCES users(id),
  deleted BOOLEAN DEFAULT false
);