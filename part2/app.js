/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

require('dotenv').config();

const app = express();

// database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'DogWalkService',
    connectionLimit: 10
});





// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.post('/login', (req, res) => {
    // SQL query to check if the user exists
    const sql = 'SELECT * FROM Users WHERE username = ? AND password_hash = ?';

    //  takes username and password from the request body from vue(fetch('/login')))
    const { username, password } = req.body;
    db.query(sql, [username, password], (err, results) => {
        user = results[0];
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length > 0) {
            // User exists, send success response
            req.session.user = {
                username: user.username,
                role: user.role
            };
            res.status(200).json({ message: 'Successful', user: results[0], success: true }); // Send the user data back

        } else {
            // User does not exist, send error response
            res.status(401).json({ message: 'Failed', error: 'Invalid username or password' });
        }
    });
});

app.get('/dogs', (req, res) => {
    //
})

// Export the app instead of listening here
module.exports = app;
