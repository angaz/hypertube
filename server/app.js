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
const apiRoutes = require('./routes.api');
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
//app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/stylesheets', express.static(path.join(__dirname, '../public/stylesheets')));
app.use('/subtitles', express.static(path.join(__dirname, '../public/subtitles')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api', apiRoutes);
app.use('/', appRoutes);

// Renders the index if no route was caught. 404 is handled by Angular
app.use((req, res) => res.render('index'));

/*
yts.getPage(1)
    .then((movies) => {
        console.log(movies[0]);
        yts.getAllSubs(movies[0])
            .then(subs => {
                console.log(subs);
            });
            // .catch(err => console.log(err));
    })
    .catch((error) => {
        console.log(error);
    });
*/

/*yts.downloadSub('http://www.yifysubtitles.com/subtitle-api/late-summer-yify-99403.zip', 'english')
    .then(sub => {
        console.log(sub);
    })
    .catch(error => console.log(error));*/

/*yts.downloadSub('https://github.com/request/request/archive/master.zip')
    .then((file) => {
        console.log(file);
    })
    .catch(error => console.log(error));*/

module.exports = app;