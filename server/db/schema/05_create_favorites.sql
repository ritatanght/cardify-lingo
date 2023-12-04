DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  set_id INT REFERENCES sets(id),
  deleted BOOLEAN DEFAULT false
);