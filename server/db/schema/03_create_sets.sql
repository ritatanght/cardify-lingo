DROP TABLE IF EXISTS sets CASCADE;

CREATE TABLE sets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  private BOOLEAN default false,
  category_id INT REFERENCES categories(id),
  user_id INT REFERENCES users(id),
  deleted BOOLEAN DEFAULT false
);