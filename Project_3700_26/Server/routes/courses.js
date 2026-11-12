const express = require('express');
const router = express.Router();
const pool = require('../util/database');
const validateCourse = require('../util/validateCourse');
const { getCoursesWithPrereqs } = require('../util/courseData');

// GET all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await getCoursesWithPrereqs(pool);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one course
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await getCoursesWithPrereqs(pool, parseInt(req.params.id));
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create course
router.post('/courses', async (req, res) => {
    const error = validateCourse(req.body);
    if (error) return res.status(400).json({ error });

    const { number, title, credits, description, prerequisites = [] } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO courses (number, title, credits, description) VALUES (?, ?, ?, ?)',
            [number, title, parseInt(credits), description || null]
        );
        const newId = result.insertId;

        for (const prereqId of prerequisites) {
            await pool.query(
                'INSERT INTO prerequisites (course_id, prereq_id) VALUES (?, ?)',
                [newId, prereqId]
            );
        }

        const newCourse = await getCoursesWithPrereqs(pool, newId);
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update course
router.put('/courses/:id', async (req, res) => {
    const error = validateCourse(req.body);
    if (error) return res.status(400).json({ error });

    const id = parseInt(req.params.id);
    const { number, title, credits, description, prerequisites = [] } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE courses SET number = ?, title = ?, credits = ?, description = ? WHERE id = ?',
            [number, title, parseInt(credits), description || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        await pool.query('DELETE FROM prerequisites WHERE course_id = ?', [id]);

        for (const prereqId of prerequisites) {
            await pool.query(
                'INSERT INTO prerequisites (course_id, prereq_id) VALUES (?, ?)',
                [id, prereqId]
            );
        }

        const updated = await getCoursesWithPrereqs(pool, id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE course
router.delete('/courses/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const course = await getCoursesWithPrereqs(pool, id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await pool.query('DELETE FROM courses WHERE id = ?', [id]);
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;