const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to return walkrequests that are open as JSON
app.get('api/walkrequests/open', async (req, res) => {
    try {
        const [walkrequests_open] = await db.execute(`
            SELECT
                WalkRequests.request_id,
                Dogs.name AS dog_name,
                WalkRequests.requested_time,
                WalkRequests.duration_minutes,
                WalkRequests.location,
                Users.username AS owner_username
            FROM WalkRequests
            JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
            JOIN Users ON Dogs.owner_id = Users.user_id
            WHERE status = "open"
        `);
        res.json(walkrequests_open);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;