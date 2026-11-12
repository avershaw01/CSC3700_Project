// server/util/courseData.js
// GIVEN CODE -- use as written

async function getCoursesWithPrereqs(pool, id) {
    let courses;
    if (id === undefined) {
        [courses] = await pool.query('SELECT * FROM courses ORDER BY id');
    } else {
        [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    }

    const [prereqs] = await pool.query(
        'SELECT course_id, prereq_id FROM prerequisites'
    );

    const result = courses.map(course => ({
        ...course,
        prerequisites: prereqs
            .filter(p => p.course_id === course.id)
            .map(p => p.prereq_id)
    }));

    if (id === undefined) return result;
    return result.length > 0 ? result[0] : null;
}

async function replaceCompletions(pool, userId, courseIds) {
    await pool.query('DELETE FROM completions WHERE user_id = ?', [userId]);
    if (courseIds.length > 0) {
        const rows = courseIds.map(id => [userId, id]);
        await pool.query('INSERT INTO completions (user_id, course_id) VALUES ?', [rows]);
    }
}

module.exports = { getCoursesWithPrereqs, replaceCompletions };