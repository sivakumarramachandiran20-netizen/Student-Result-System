const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/results.db", (err) => {

    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }

});

db.serialize(() => {

    // Students table
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            register_number TEXT UNIQUE NOT NULL,
            department TEXT NOT NULL,
            semester INTEGER NOT NULL,
            role TEXT NOT NULL DEFAULT 'student'
        )
    `);

    // Marks table
    db.run(`
        CREATE TABLE IF NOT EXISTS marks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            internal_mark INTEGER NOT NULL,
            external_mark INTEGER NOT NULL,
            total_mark INTEGER NOT NULL,
            grade TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(id)
        )
    `);

});

module.exports = db;