"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

//retries db connection if failed
const mongoUrl = 'mongodb://wethinkcode:zHuOIrJYftfE48LgFGiQJizVxVuZsUdQZ4tn3oDtRV47h1uow503580ogz0SfYW5KlTJcylqjXbBJ0PR83F7cQ==@wethinkcode.documents.azure.com:10250/hypertube?ssl=true';
mongoose.Promise = global.Promise;
const connectWithRetry = () => {
	return mongoose.connect(mongoUrl, (err) => {
		if (err) {
			console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
			setTimeout(connectWithRetry, 5000);
		}
	});
};
connectWithRetry();

// mongoose.connect('mongodb://wethinkcode:zHuOIrJYftfE48LgFGiQJizVxVuZsUdQZ4tn3oDtRV47h1uow503580ogz0SfYW5KlTJcylqjXbBJ0PR83F7cQ==@wethinkcode.documents.azure.com:10250/hypertube?ssl=true');

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

const eztv = require('./api/eztv.api');
// eztv.getShows().then(response => console.log(response));
/*eztv.getShowInfo({id: 23, slug: 'the-big-bang-theory'})
    .then(/!*response => console.log(require('util').inspect(response, {depth: null, breakLength: Infinity}))*!/)
    .catch(console.log.bind(console));*/

require('node-cron').schedule('6 * * * *', () => {
    require('./api/movie.api')
        .update()
        .then(result => console.log(`New movies: ${result}`))
        .catch(error => console.log(error));
});

module.exports = app;