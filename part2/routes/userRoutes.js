/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const express = require('express');
const router = express.Router();
const db = require('../models/db');


// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST login (dummy version)
router.post('/', (req, res) => {
  console.log('Login route hit');
  // SQL query to check if the user exists
  const sql = 'SELECT * FROM Users WHERE username = ? AND password_hash = ?';
  //  takes username and password from the request body from vue(fetch('/login')))
  const { username, password } = req.body;
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      // User exists, send success response
      const user = results[0];
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      // checking user session cookies
      console.log('Session user:', req.session.user);
      // Remove password_hash from the user object before sending it back (security reasons)
      delete user.password_hash;
      res.status(200).json(
        {
          message: 'Successful',
          user: results[0],
          success: true
        }
      ); // Send the user data back
    } else {
      // User does not exist, send error response
      res.status(401).json({ message: 'Failed', error: 'Invalid username or password' });
    }
  });
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({
    success: true,
    id: req.session.user.id,
    role: req.session.user.role
  });
});



module.exports = router;
