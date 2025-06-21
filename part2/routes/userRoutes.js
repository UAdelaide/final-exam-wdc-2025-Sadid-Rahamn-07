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

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role, createdAT } = req.body;
  console.log('Registering user:', { username, email, role });
  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role, createdAT)
      // VALUES (?, ?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({
      success: true,
      message: 'User registered',
      user_id: result.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST login (final version)
router.post('/login', async (req, res) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username = ? AND password_hash = ?';
    const { username, password } = req.body;

    const [results] = await db.query(sql, [username, password]);

    if (results.length > 0) {
      const user = results[0];
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      console.log('Session user:', req.session.user);
      delete user.password_hash;
      res.status(200).json({
        message: 'Successful',
        user,
        success: true
      });
    } else {
      res.status(401).json({ message: 'Failed', error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.get('/load_user_dogs', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const username = req.session.user.username;

  try {
    const query = `
      SELECT Dogs.name, Dogs.dog_id
      FROM Dogs
      INNER JOIN Users ON Dogs.owner_id = Users.user_id
      WHERE Users.username = ?
    `;

    const [results] = await db.query(query, [username]);

    if (results.length > 0) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: 'No dogs found for this user' });
  } catch (err) {
    console.error('Database query error:', err);
    return res.status(500).json({ error: 'Database query error' });
  }

});

// GET all dogs
router.get('/dogs', async (req, res) => {
  const dogs_sql = 'SELECT * FROM Dogs';
  try {
    const [results] = await db.query(dogs_sql);
    res.status(200).json(results);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// GET current user (me)
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
