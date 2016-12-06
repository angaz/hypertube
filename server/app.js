"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const mongoose = require('mongoose');
const appRoutes = require('./routes');
const apiRoutes = require('./routes.api');
const movies = require('./api/movie.api');
const yts = require('./api/yts.api');
const app = express();
const hbs = exphbs.create({
	extname: '.hbs',
	helpers: {
		angular: function(options) {
			return options.fn();
		}
	}
});

//retries db connection if failed
const mongoUrl = 'mongodb://hypertube:eyVhqp8urJdS3CWn@52.165.47.251:7342/hypertube?ssl=true';
mongoose.Promise = global.Promise;

function connectWithRetry (counter) {
	if (counter < 5) {
        mongoose.connect(mongoUrl, (err) => {
            if (err) {
                console.error(`Failed to connect to mongo on startup - retrying in 5 sec\n Retry: ${counter}`, err);
                setTimeout(() => connectWithRetry(counter + 1), 5000);
            } else {
            	console.log('Connected to MongoDB successfully');
			}
        });
	} else {
		throw new Error('Retried connecting to MongoDB 5 times');
	}
}

connectWithRetry(0);

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

express.static.mime.define({'text/vtt': ['vtt']});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/stylesheets', express.static(path.join(__dirname, '../public/stylesheets')));
app.use('/captions', express.static(path.join(__dirname, '../public/captions')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
	next();
});

app.use((req, res, next, err) => {
    console.error(err);
    res.send({status:500, message: 'internal error', type:'internal'});
});

app.use('/api', apiRoutes);
app.use('/', appRoutes);

// Renders the index if no route was caught. 404 is handled by Angular
app.use((req, res) => res.render('index'));

movies.update()
	.then(result => console.log(`New movies: ${result}`))
	.catch(error => console.log(error));

cron.schedule('0 * * * *', () => {
    movies.update()
        .then(result => console.log(`New movies: ${result}`))
        .catch(error => console.log(error));
});

module.exports = app;
