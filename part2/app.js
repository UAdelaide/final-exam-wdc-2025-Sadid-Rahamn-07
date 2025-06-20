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

// setting up a default user session if not logged in
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            username: 'guest',
            role: 'visitor'
        };
    }
    next();
});

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

        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length > 0) {
            // User exists, send success response
            const user = results[0];
            req.session.user = {
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

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });

    });
});

app.get('/load_user_dogs', (res, req) => {
    const username = req.session.user.username; // fetching username from session
    console.log(username);
    // SQL query to get all dogs for the user
    const query = `
        SELECT *
        FROM Dogs
        `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length > 0) {
            console.log('User dogs:', results);
            res.status(200).json(results); // Send the list of dogs back
        } else {
            res.status(404).json({ message: 'No dogs found for this user' });
        }
    });


});

app.get('/dogs', (req, res) => {
    // SQL query to get all dogs
    const dogs_sql = 'SELECT * FROM Dogs';
    db.query(dogs_sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results); // Send the list of dogs back
    });
});

app.get('/session', (req, res) => {
    if (req.session.user) {
        console.log('Session user:', req.session.user);
        res.json({
            sessionUser: req.session.user
        });
    } else {
        res.status(401).json({ message: 'No active session' });
    }
});

// Export the app instead of listening here
module.exports = app;
