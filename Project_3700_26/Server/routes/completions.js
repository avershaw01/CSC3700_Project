const express = require('express');
const router = express.Router();
const pool = require('../util/database');
const { getCoursesWithPrereqs, replaceCompletions } = require('../util/courseData');

const USER_ID = 1; // M3: replaced by the logged-in user's id

function isValidCompletionSet(courses, completed) {
    return completed.every(id => {
        const course = courses.find(c => c.id === id);
        return course && course.prerequisites.every(p => completed.includes(p));
    });
}

// GET completions
router.get('/completions', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT course_id FROM completions WHERE user_id = ?',
            [USER_ID]
        );
        const ids = rows.map(r => r.course_id);
        res.json(ids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT replace completions
router.put('/completions', async (req, res) => {
    const courseIds = req.body;

    if (!Array.isArray(courseIds)) {
        return res.status(400).json({ error: 'Body must be an array of course ids' });
    }

    try {
        const courses = await getCoursesWithPrereqs(pool);

        if (!isValidCompletionSet(courses, courseIds)) {
            return res.status(400).json({ error: 'Completion list violates prerequisites' });
        }

        await replaceCompletions(pool, USER_ID, courseIds);
        res.json(courseIds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;