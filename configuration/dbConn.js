const Promise = require('bluebird');
const Config = require('./config');
const initOptions = {
	promiseLib: Promise,
	query(e) {
		 //console.log(e.query);
	},
	error(error, e) {
		console.log("hello i a,m in ");
		if (e.cn) {
			//console.log('CN:', e.cn);
			console.log('EVENT:', error.message || error);
		}
	},
};
const pgp = require('pg-promise')(initOptions);

const cn = {
	host: Config.db.DB_HOST, // 'localhost' is the default;
	port: Config.db.DB_PORT, // 5432 is the default;
	database: Config.db.DB_NAME,
	user: Config.db.DB_USER,
	password: Config.db.DB_PASS,
};
// const cn = 'postgres://process.env.DB_USER:process.env.DB_PASS@process.env.DB_HOST:process.env.DB_PORT/process.env.DB_NAME';

pgp.pg.types.setTypeParser(1114, (s) => s);

const db = pgp(cn); // database instance;

db.connect()
	.then((obj) => {
		obj.done(); // success, release the connection;
	})
	.catch((error) => {
		console.log('ERROR:', error.message || error);
	});

module.exports = db;
