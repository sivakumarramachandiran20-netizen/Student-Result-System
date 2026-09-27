const db = require("./database/database");

const marks = [
    [2, "Data Structures", 24, 60, 84, "A"],
    [2, "Database Management Systems", 25, 64, 89, "A+"],
    [2, "Operating Systems", 23, 59, 82, "A"],
    [2, "Computer Networks", 22, 57, 79, "B+"],
    [2, "Software Engineering", 24, 61, 85, "A"]
];

const sql = `
    INSERT INTO marks
    (student_id, subject, internal_mark, external_mark, total_mark, grade)
    VALUES (?, ?, ?, ?, ?, ?)
`;

marks.forEach((mark) => {

    db.run(sql, mark, function(err) {

        if (err) {
            console.error("Error:", err.message);
        } else {
            console.log(`Added ${mark[1]} for Student 2`);
        }

    });

});

setTimeout(() => {
    db.close();
}, 1000);