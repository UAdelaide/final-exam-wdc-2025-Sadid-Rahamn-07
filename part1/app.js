var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
    try {
        // Connect to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '' // Set your MySQL root password
        });

        // Create the database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
        await connection.end();

        // Now connect to the created database
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });
    } catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

// Route to return dogs as JSON
app.get('/dogs', async (req, res) => {
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
app.get('/walkrequests/open', async (req, res) => {
    try {
        const [dogs_data] = await db.execute(`
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
        res.json(dogs_data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Route to walkers summary as JSON
// Route to walkers summary as JSON
app.get('/api/walkers/summary', async (req, res) => {
    try {
        const [walkers_summary] = await db.execute(`
            SELECT
                u.username AS walker_username,
                COUNT(r.rating) AS total_ratings,
                ROUND(AVG(r.rating), 2) AS average_rating,
                COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks
            FROM Users u
            LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
            LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
            LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
            WHERE u.role = 'walker'
            GROUP BY u.username;
        `);
        res.json(walkers_summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch walker summary data' });
    }
});


app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
