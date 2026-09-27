const db = require("./database/database");

const marks = [
    [1, "Data Structures", 25, 65, 90, "A+"],
    [1, "Database Management Systems", 23, 60, 83, "A"],
    [1, "Operating Systems", 22, 58, 80, "A"],
    [1, "Computer Networks", 24, 62, 86, "A"],
    [1, "Software Engineering", 21, 55, 76, "B+"]
];

const sql = `
    INSERT INTO marks
    (student_id, subject, internal_mark, external_mark, total_mark, grade)
    VALUES (?, ?, ?, ?, ?, ?)
`;

marks.forEach((mark) => {

    db.run(sql, mark, function(err) {

        if (err) {
            console.error("Error adding mark:", err.message);
        } else {
            console.log(
                `Added ${mark[1]} - Total: ${mark[4]} - Grade: ${mark[5]}`
            );
        }

    });

});

setTimeout(() => {
    db.close();
}, 1000);