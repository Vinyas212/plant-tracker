const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, "../../../database/plant-tracker.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS plants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  species TEXT DEFAULT '',
  location TEXT DEFAULT '',
  sunlight TEXT DEFAULT 'Indirect',
  watering_frequency INTEGER DEFAULT 7,
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS care_instructions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plant_id INTEGER NOT NULL UNIQUE,
  instructions TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watering_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plant_id INTEGER NOT NULL,
  watered_at TEXT DEFAULT CURRENT_TIMESTAMP,
  notes TEXT DEFAULT '',
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
`);

module.exports = db;
