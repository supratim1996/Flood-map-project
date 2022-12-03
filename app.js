// let swaggerDocument = require('./assets/swagger/swagger.json');
// let swaggerUi = require('swagger-ui-express');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const nocache = require('nocache');
const helmet = require('helmet');
const frameguard = require('frameguard');
let floodRoute = require('./routes/flood');

var app = express();
// Remove the X-Powered-By headers.
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(nocache());
app.use(helmet.noSniff());
app.use(frameguard());
app.use(helmet.xssFilter());

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

/*ROUTES*/
app.use('/flood', floodRoute);
/*ROUTES*/

app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// render the error page
	res.status(err.status || 500);

	console.log('err', err);

	res.json({
		message: err.message,
		error: req.app.get('env') === 'development' ? err : {},
	});
});

module.exports = app;
