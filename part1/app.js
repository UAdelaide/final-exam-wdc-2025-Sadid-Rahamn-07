var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();



// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const dogsRouter = require('./routes/dogs');
const walkRequestsRouter = require('./routes/walkRequests');
const walkersRouter = require('./routes/walkers');

// Use routers
app.use('/api', dogsRouter);
app.use('/api/walkrequests', walkRequestsRouter);
app.use('/api/walkers', walkersRouter);

module.exports = app;
