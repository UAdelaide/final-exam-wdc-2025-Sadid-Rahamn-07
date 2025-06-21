const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', (req, res) => {
  const sql = `
    SELECT
      u.user_id AS walker_id,
      u.username AS walker_username,
      COUNT(CASE WHEN wa.status = 'accepted' THEN 1 END) AS accepted_walks,
      COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks,
      COUNT(CASE WHEN wa.status = 'rejected' THEN 1 END) AS rejected_walks
    FROM Users u
    LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id
    LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
    WHERE u.role = 'walker'
    GROUP BY u.user_id, u.username;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching walker summary:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;