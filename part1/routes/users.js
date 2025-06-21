var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route to return dogs as JSON
router.get('/dogs', async (req, res) => {
    try {
        const [dogs_data] = await db.execute(`
            SELECT
                Dogs.name AS dog_name,
                Dogs.size,
                Users.username AS owner_username
            FROM Dogs
            JOIN Users ON Dogs.owner_id = Users.user_id
        `);
        res.json(dogs_data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Route to return walkrequests that are open as JSON
app.get('/walkrequests/open', async (req, res) => {
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
