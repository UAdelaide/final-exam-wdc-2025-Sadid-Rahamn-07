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
