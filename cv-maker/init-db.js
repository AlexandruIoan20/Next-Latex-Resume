const Database = require('better-sqlite3');
const db = new Database('cv_database.db');

console.log('Initializing database structure...');

// 1. Users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// 2. CV (Resumes)
db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT DEFAULT 'New CV',
    description TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// 3. ContactDetails
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    phoneNumber TEXT NOT NULL,
    address TEXT,
    city TEXT,
    county TEXT,
    birthDate TEXT NOT NULL,
    birthPlace TEXT,
    nationality TEXT,
    civilStatus TEXT,
    linkedIn TEXT,
    personalWebsite TEXT,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 4. Experiences
db.exec(`
  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    city TEXT NOT NULL,
    employer TEXT NOT NULL,
    startDate TEXT,
    finishDate TEXT,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 5. Education
db.exec(`
  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    degree TEXT NOT NULL,
    school TEXT NOT NULL,
    startDate TEXT,
    finishDate TEXT,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 6. Projects
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    techStack TEXT,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 7. Courses
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    institution TEXT,
    startDate TEXT,
    finishDate TEXT,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 8. Languages
db.exec(`
  CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    language TEXT NOT NULL,
    level TEXT NOT NULL,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 9. Interests
db.exec(`
  CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

// 10. Abilities
db.exec(`
  CREATE TABLE IF NOT EXISTS abilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    userId INTEGER NOT NULL,
    expiresAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log('Database created successfully: cv_database.db');
db.close();