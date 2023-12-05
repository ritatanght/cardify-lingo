const db = require("../../configs/db.config");
const searchByText = (searchQuery) => {
  const searchTerm = `%${searchQuery}%`;

  const query = `
    SELECT lang_sets.title, lang_sets.id, lang_sets.private, lang_sets.user_id, users.username AS username, languages.name AS language
    FROM lang_sets 
    JOIN users ON lang_sets.user_id = users.id
    JOIN languages ON lang_sets.language_id = languages.id 
    WHERE (lang_sets.title ILIKE $1 OR lang_sets.description ILIKE $1 OR languages.name ILIKE $1)
    AND lang_sets.deleted = false
  `;

  return db.query(query, [searchTerm]);
};

module.exports = {
  searchByText,
};
