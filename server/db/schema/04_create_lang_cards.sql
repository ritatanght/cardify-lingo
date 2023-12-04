DROP TABLE IF EXISTS ang_cards CASCADE;

CREATE TABLE lang_cards (
  id SERIAL PRIMARY KEY,
  lang_set_id INT REFERENCES lang_sets(id),
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  deleted BOOLEAN DEFAULT false
);