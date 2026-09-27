const db = require("./database/database");

db.run(
    "ALTER TABLE students ADD COLUMN role TEXT DEFAULT 'student'",
    function (err) {

        if (err) {
            console.error("Error adding role column:", err.message);
        } else {
            console.log("Role column added successfully!");
        }

        db.close();
    }
);