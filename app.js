var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/api/header', require('./routes/headers'));
app.use('/api/provider', require('./routes/providers'));
app.use('/api/parent', require('./routes/parents'));
app.use('/api/children', require('./routes/children'));
app.use('/api/month', require('./routes/months'));
app.use('/api/year', require('./routes/years'));
app.use('/api/story', require('./routes/stories'));
app.use('/api/week', require('./routes/weeks'));
app.use('/api/files', require('./routes/files'));

module.exports = app;
