const db = require("../db/database");

const getAllRecords = () => {
  return db.prepare("SELECT * FROM records ORDER BY id ASC").all();
};

const getRecordById = (id) => {
  return db.prepare("SELECT * FROM records WHERE id = ?").get(id);
};

const createRecord = (data) => {
  const statement = db.prepare(`
        INSERT INTO records ( title, category, description, status)
        VALUES (?, ?, ?, ?)`);

  const result = statement.run(
    data.title.trim(),
    data.category.trim(),
    data.description.trim(),
    data.status.trim(),
  );

  return getRecordById(result.lastInsertRowid);
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
};
