const bcrypt = require("bcrypt");
const db = require("./database/database");

async function createStudent() {

    const name = "Priya Sharma";
    const email = "priya@college.edu";
    const password = "student456";
    const registerNumber = "2026002";
    const department = "Computer Science";
    const semester = 5;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `
            INSERT INTO students
            (name, email, password, register_number, department, semester)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword,
                registerNumber,
                department,
                semester
            ],
            function(err) {

                if (err) {
                    console.error("Error creating student:", err.message);
                    return;
                }

                console.log("Student created successfully!");
                console.log("Student ID:", this.lastID);
                console.log("Email:", email);
                console.log("Password:", password);

            }
        );

    } catch (error) {

        console.error("Error:", error.message);

    }
}

createStudent();