const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const db = require("./database/database");

const app = express();

const PORT = 3000;

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));

// Serve CSS
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
    session({
        secret: "student-result-secret",
        resave: false,
        saveUninitialized: false
    })
);

// Login page
app.get("/", (req, res) => {
    res.render("login");
});

// Login process
app.post("/login", (req, res) => {

    const email = req.body.email.trim();
    const password = req.body.password;

    console.log("Login attempt:", email);

    db.get(
        "SELECT * FROM students WHERE email = ?",
        [email],
        async (err, student) => {

            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).send("Database error");
            }

            if (!student) {
                console.log("Student not found");
                return res.send("Invalid email or password");
            }

            console.log("Student found:", student.email);

            const passwordMatch = await bcrypt.compare(
                password,
                student.password
            );

            console.log("Password match:", passwordMatch);

            if (!passwordMatch) {
                return res.send("Invalid email or password");
            }

            req.session.studentId = student.id;

            console.log("Login successful for student ID:", student.id);

res.redirect("/dashboard");        }
    );
});
// STUDENT DASHBOARD
app.get("/dashboard", (req, res) => {

    if (!req.session.studentId) {
        return res.redirect("/");
    }

    db.get(
        "SELECT * FROM students WHERE id = ?",
        [req.session.studentId],
        (err, student) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            if (!student) {
                return res.redirect("/");
            }

            db.all(
                "SELECT * FROM marks WHERE student_id = ?",
                [req.session.studentId],
                (err, marks) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database error");
                    }

                    res.render("dashboard", {
                        student: student,
                        marks: marks
                    });

                }
            );

        }
    );
});
app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Unable to logout");
        }

        res.redirect("/");
    });

});
// ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
    res.render("admin-login");
});

// ADMIN LOGIN
app.post("/admin/login", (req, res) => {

    console.log("Admin email entered:", req.body.email);
    console.log("Admin password entered:", req.body.password);


    const { email, password } = req.body;

    // Temporary admin credentials for development
    if (
    email === "admin@college.edu" &&
    password === "admin123"
) {
        req.session.admin = true;

        return res.redirect("/admin/dashboard");
    }

    res.send("Invalid admin email or password");
});
// ADMIN DASHBOARD
app.get("/admin/dashboard", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    db.all(
        "SELECT id, name, email, register_number, department, semester FROM students",
        (err, students) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            res.render("admin-dashboard", {
                students: students
            });

        }
    );
});
// MANAGE STUDENT MARKS
app.get("/admin/student/:id/marks", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const studentId = req.params.id;

    db.get(
        "SELECT * FROM students WHERE id = ?",
        [studentId],
        (err, student) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            if (!student) {
                return res.status(404).send("Student not found");
            }

            db.all(
                "SELECT * FROM marks WHERE student_id = ?",
                [studentId],
                (err, marks) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database error");
                    }

                    res.render("admin-marks", {
                        student: student,
                        marks: marks
                    });

                }
            );

        }
    );

});// ADD MARK FOR A STUDENT
app.post("/admin/student/:id/marks/add", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const studentId = req.params.id;

    const {
        subject,
        internal_mark,
        external_mark,
        grade
    } = req.body;

    const total_mark =
        Number(internal_mark) + Number(external_mark);

    db.run(
        `INSERT INTO marks
        (student_id, subject, internal_mark, external_mark, total_mark, grade)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            studentId,
            subject,
            internal_mark,
            external_mark,
            total_mark,
            grade
        ],
        function (err) {

            if (err) {
                console.error("Error adding mark:", err.message);
                return res.status(500).send("Failed to add mark");
            }

            console.log("Mark added successfully!");

            res.redirect(`/admin/student/${studentId}/marks`);
        }
    );

});

// EDIT MARK PAGE
app.get("/admin/marks/:id/edit", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const markId = req.params.id;

    db.get(
        "SELECT * FROM marks WHERE id = ?",
        [markId],
        (err, mark) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            if (!mark) {
                return res.status(404).send("Mark not found");
            }

            res.render("edit-mark", {
                mark: mark
            });
        }
    );
});


// UPDATE MARK
app.post("/admin/marks/:id/update", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const markId = req.params.id;

    const {
        subject,
        internal_mark,
        external_mark,
        grade
    } = req.body;

    const total_mark =
        Number(internal_mark) + Number(external_mark);

    db.run(
        `UPDATE marks
         SET subject = ?,
             internal_mark = ?,
             external_mark = ?,
             total_mark = ?,
             grade = ?
         WHERE id = ?`,
        [
            subject,
            internal_mark,
            external_mark,
            total_mark,
            grade,
            markId
        ],
        function (err) {

            if (err) {
                console.error("Error updating mark:", err.message);
                return res.status(500).send("Failed to update mark");
            }

            console.log("Mark updated successfully!");

            db.get(
                "SELECT student_id FROM marks WHERE id = ?",
                [markId],
                (err, mark) => {

                    if (err || !mark) {
                        return res.redirect("/admin/dashboard");
                    }

                    res.redirect(
                        `/admin/student/${mark.student_id}/marks`
                    );
                }
            );
        }
    );
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
