const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/open', (req, res) => {
  const sql = `
    SELECT wr.request_id, d.name AS dog_name, wr.requested_time,
           wr.duration_minutes, wr.location, wr.status
    FROM WalkRequests wr
    JOIN Dogs d ON wr.dog_id = d.dog_id
    WHERE wr.status = 'open';
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching open walk requests:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;