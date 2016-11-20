"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const yts = require('./yts.api');
const appRoutes = require('./routes');
const app = express();
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        angular: function(options) {
            return options.fn();
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
    secret: 'Ilivellamas',
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/', appRoutes);

// Renders the index if no route was caught. 404 is handled by Angular
app.use((req, res) => {
  res.render('index');
});

/*
yts.getPage(1)
    .then((movies) => {
        yts.getAllSubs(movies[0].imdb_code)
            .then((subs) => {
                console.log(require('util').inspect(subs, {depth: null}));
            });
    })
    .catch((error) => {
        console.log(error);
    });
*/

//yts.downloadSub('http://www.yifysubtitles.com/subtitle-api/late-summer-yify-99403.zip');
//yts.downloadSub('https://github.com/request/request/archive/master.zip');

module.exports = app;