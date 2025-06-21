var express = require('express');
var router = express.Router();
var db = require('./'); // Import the database connection

/* GET users listing. */
router.get('/', function (req, res, next) {
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
router.get('/walkrequests/open', async (req, res) => {
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

// Route to walkers summary as JSON
router.get('/walkers/summary', async (req, res) => {
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
