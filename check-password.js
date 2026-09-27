const bcrypt = require("bcrypt");
const db = require("./database/database");

const email = "arun@college.edu";
const password = "student123";

db.get(
    "SELECT password FROM students WHERE email = ?",
    [email],
    async (err, student) => {

        if (err) {
            console.error("Database error:", err.message);
            return;
        }

        if (!student) {
            console.log("Student not found.");
            return;
        }

        const match = await bcrypt.compare(password, student.password);

        console.log("Password match:", match);

        db.close();
    }
);