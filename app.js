var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var index = require('./routes/index');

var app = express();

var mongo_pw = process.env.Mongo_PW;
var url = 'mongodb://localhost:27017/Travel';
MongoClient.connect(url, function (err, db)
{
    assert.equal(null, err);
    console.log('connected to MongoDB');

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    // make db available to routes
// add app.use() call to add the db to each request

// This function will run before each route handler…


    app.use('/', function (req, res, next)
    {
        req.db = db;
        next();

    });

    app.use('/', index);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}); // end of MongoDb client

module.exports = app;
