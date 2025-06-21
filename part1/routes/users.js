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

module.exports = router;
