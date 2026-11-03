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

const updateRecord = (id, data) => {
  const statement = db.prepare(`
        UPDATE records
        SET title = ?, category = ?, description = ?, status = ?
        wHERE id = ?
        `);

  const result = statement.run(
    data.title.trim(),
    data.category.trim(),
    data.description.trim(),
    data.status.trim(),
    id,
  );

  if (result.changes === 0) {
    return null;
  }

  return getRecordById(id);
};

const deleteRecord = (id) => {
  const statement = db.prepare(`
        DELETE FROM records WHERE id = ?`);

  const result = statement.run(id);

  return result.changes > 0;
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
