import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database
const dbPath = path.join(process.cwd(), 'work-tasks.db');
const db = new Database(dbPath);

// Create the tasks table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    tags TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createTableQuery);

export default db;
