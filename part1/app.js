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
            SELECT *
            FROM Dogs`
        );
        res.json(dogs_data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


// Route to return walkrequests that are open as JSON
app.get('/walkrequests/open', async (req, res) => {
    try {
        const [dogs_data] = await db.execute(`
            SELECT WalkRequests.request_id, Dogs.name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Dogs.owner_id
            FROM WalkRequests
            JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
            JOIN Users ON Dogs.owner_id = Users.dog_id
            WHERE status = "open"
        `);
        res.json(dogs_data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Route to walkers summary as JSON
app.get('/walkers/summary', async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT *
            FROM WalkRatings`
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
