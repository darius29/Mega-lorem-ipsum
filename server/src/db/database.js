const Database = require("better-sqlite3");
const path = require("node:path");
const fs = require("node:fs");

//Database directory
const dataDirectory = path.join(__dirname, "../../data");

fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath = path.join(dataDirectory, "records.db");

//Connect To SQLite
const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
