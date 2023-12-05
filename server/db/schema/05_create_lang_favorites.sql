DROP TABLE IF EXISTS lang_favorites CASCADE;

CREATE TABLE lang_favorites (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  lang_set_id INT REFERENCES lang_sets(id) NOT NULL,
  deleted BOOLEAN DEFAULT false
);