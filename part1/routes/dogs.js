const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT d.dog_id, d.name, d.size, d.owner_id, u.username AS owner_username
    FROM Dogs d
    JOIN Users u ON d.owner_id = u.user_id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching dogs:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;