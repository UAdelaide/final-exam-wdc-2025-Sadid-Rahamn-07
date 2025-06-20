/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

// database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10 // Adjust as needed
});





// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.post('/login', (req, res) => {

    // SQL query to check if the user exists
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    //  takes username and password from the request body from vue(fetch('/login')))
    const { username, password } = req.body;
    db.query(sql, [username, password], (err, results) => {
        if(err){
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
    });
});

// Export the app instead of listening here
module.exports = app;
