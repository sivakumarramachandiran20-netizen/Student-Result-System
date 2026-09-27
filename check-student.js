const db = require("./database/database");

db.get(
    "SELECT id, name, email, register_number, department, semester FROM students WHERE email = ?",
    ["arun@college.edu"],
    (err, student) => {

        if (err) {
            console.error("Database error:", err.message);
            return;
        }

        if (!student) {
            console.log("Student NOT found.");
            return;
        }

        console.log("Student found!");
        console.log(student);

        db.close();
    }
);