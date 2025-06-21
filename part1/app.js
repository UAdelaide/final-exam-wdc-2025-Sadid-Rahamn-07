var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var app = express();

// Middle   
app.use(express.static(path.join(__dirname, 'public')));
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


const dogsRouter = require('./routes/dogs');
const walkRequestsRouter = require('./routes/walkRequests');
const walkersRouter = require('./routes/walkers');

// Use routers
app.use('/api', dogsRouter);
app.use('/api/walkrequests', walkRequestsRouter);
app.use('/api/walkers', walkersRouter);

module.exports = app;
