const express = require('express');
const router = express.Router();


// Route to walkers summary as JSON

router.get('/', async (req, res) => {
    res.json({ message: 'Welcome to the Walkers API' });
});



router.get('/summary', async (req, res) => {
    try {
        const [walkers_summary] = await db.execute(`
        SELECT
            u.username AS walker_username,
            COUNT(DISTINCT r.rating_id) AS total_ratings,
            ROUND(AVG(r.rating), 2) AS average_rating,
            COUNT(DISTINCT wa.status = 'accepted' AND wr.status = 'completed') AS completed_walks
        FROM Users u
        LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id
        LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
        LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
        WHERE u.role = 'walker'
        GROUP BY u.user_id, u.username;
    `);
        res.json(walkers_summary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;