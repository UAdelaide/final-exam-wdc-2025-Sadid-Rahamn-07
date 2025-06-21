const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to walkers summary as JSON

router.get('/', async (req, res) => {
    res.json({ message: 'Welcome to the Walkers API' });
});



router.get('/summary', async (req, res) => {
    try {
        const [walkers_summary] = await db.execute(`
        SELECT
            u.username AS walker_username,
            COUNT(wa.rating) AS total_ratings,
            AVG(wa.rating) AS average_rating,
            COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks
            FROM Users u
            LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id
            LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
            WHERE u.role = 'walker'
            GROUP BY u.user_id, u.username;
    `);
        res.json(walkers_summary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;