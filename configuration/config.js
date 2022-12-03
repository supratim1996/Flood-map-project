const dateFormat = require('dateformat');

const config = {
	jwt: {
		secret: 'QWrt567Hvx318',
	},
	db: {
		DB_HOST: 'flood-map-database.cu6hpv5v4oir.ap-south-1.rds.amazonaws.com',
		DB_NAME: 'flood-database',
		DB_USER: 'postgres',
		DB_PASS: 'Asdqwe12!',
		DB_PORT: 5432,
	},
	errorFileName: `${process.env.BASE_PATH}/flood-api/log/error_log_${dateFormat(
		new Date(),
		'mm_yyyy'
	)}.txt`,
	errorLogPath: `${process.env.BASE_PATH}/flood-api/log`,
	errorText: {
		value: 'An internal error has occurred. Please try again later.',
	},
};
module.exports = config;
