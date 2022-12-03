// const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');
const dateMath = require('date-arithmetic');
const fs = require('fs');
const Config = require('../configuration/config');
const errorLogFile = Config.errorFileName;
// var transportConfig = Config.transportConfig;
// var transportConfigNoReply = Config.transportConfigNoReply;
// const CAN_MAIL = false; // All the mails being sent is controlled by this variable
module.exports = {
	currentDate: () => {
		var now = module.exports.calcTime();

		return dateFormat(now, 'yyyy-mm-dd');
	},
	currentTime: () => {
		var now = module.exports.calcTime();

		return dateFormat(now, 'HH:MM:ss');
	},
	currentDateTime: () => {
		var now = module.exports.calcTime();

		return dateFormat(now, 'yyyy-mm-dd HH:MM:ss');
	},
	changeDateFormat: (date, separator, format) => {
		// format dd.mm.yyyy || mm.dd.yyyy
		var match = format.split('.');
		return dateFormat(date, `${match[0]}${separator}${match[1]}${separator}${match[2]}`);
	},
	formatDate: (input_date, new_format) => {
		return dateFormat(input_date, new_format);
	},
	dayCountExcludingWeekends: (total_sla) => {
		var now_date = module.exports.calcTime();
		var due_date = module.exports.calcTime();
		var allocated_days = total_sla;
		var days_taken = 0;

		for (var i = 1; i < 160; i++) {
			if (days_taken >= allocated_days) {
				break;
			}
			due_date = dateMath.add(now_date, i, 'day');
			if (dateFormat(due_date, 'ddd') == 'Sat' || dateFormat(due_date, 'ddd') == 'Sun') {
			} else {
				days_taken++;
			}
		}

		return i - 1;
	},
	nextDate: (value, unit) => {
		var unitArr = [
			'milliseconds',
			'second',
			'minutes',
			'hours',
			'day',
			'weekday',
			'month',
			'year',
			'decade',
			'century',
		];

		if (unitArr.indexOf(unit) == '-1') {
			var e = new Error('Invalid unit given.');
			return e;
		}

		if (value <= 0) {
			var e = new Error('Invalid days given.');
			return e;
		}

		var date = module.exports.calcTime();

		return dateMath.add(date, value, unit);
	},
	logError: (err) => {
		console.log('Error from common ==>', err);

		var matches = err.stack.split('\n');
		var regex1 = /\((.*):(\d+):(\d+)\)$/;
		var regex2 = /(.*):(\d+):(\d+)$/;
		var errorArr1 = regex1.exec(matches[1]);
		var errorArr2 = regex2.exec(matches[1]);
		if (errorArr1 !== null || errorArr2 !== null) {
			var errorText = matches[0];
			if (errorArr1 !== null) {
				var errorFile = errorArr1[1];
				var errorLine = errorArr1[2];
			} else if (errorArr2 !== null) {
				var errorFile = errorArr2[1];
				var errorLine = errorArr2[2];
			}

			var now = module.exports.calcTime();
			var date_format = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');

			var errMsg = `\n DateTime: ${date_format} \n ${errorText} \n Line No : ${errorLine} \n File Path: ${errorFile} \n`;

			var errHtml = `<!DOCTYPE html><html><body><p>${errorText}</p><p>Line No : ${errorLine}</p><p>File Path: ${errorFile}</p></body></html>`;

			//LOG ERR
			fs.appendFile(errorLogFile, errMsg, (err) => {
				if (err) throw err;
				//console.log('The file has been saved!');
			});
			//LOG ERR
		}
	},
	getErrorText: (err) => {
		var matches = err.stack.split('\n');
		return matches[0];
	},
	asyncForEach: async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	},
	getSleep: (ms) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	},
	isEmptyObj: (obj) => {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	},
	logErrorText: (custom_text, error_text) => {
		var now = module.exports.calcTime();
		var date_format = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');

		var errMsg = `\n DateTime: ${date_format} \n ${error_text} \n ${custom_text} \n`;
		//LOG ERR
		fs.appendFile(errorLogFile, errMsg, (err) => {
			if (err) throw err;
			//console.log('Error has been logged!');
		});
		//LOG ERR
	},
	calcTime: () => {
		// create Date object for current location
		var d = new Date();

		// convert to msec
		// subtract local time zone offset
		// get UTC time in msec
		var utc = d.getTime() + d.getTimezoneOffset() * 60000;

		// create new Date object for different city
		// using supplied offset
		var nd = new Date(utc + 3600000 * 5.5);

		// return time as a string
		return nd;
	},
	calcTimeNew: (val) => {
		// create Date object for current location
		var d = new Date(val);

		// convert to msec
		// subtract local time zone offset
		// get UTC time in msec
		var utc = d.getTime() + d.getTimezoneOffset() * 60000;

		// create new Date object for different city
		// using supplied offset
		var nd = new Date(utc + 3600000 * 5.5);

		// return time as a string
		return nd;
	},
	calcInputTime: (valu) => {
		// create Date object for current location
		var d = new Date(valu);

		// convert to msec
		// subtract local time zone offset
		// get UTC time in msec
		var utc = d.getTime();

		// create new Date object for different city
		// using supplied offset
		var nd = new Date(utc + 3600000 * 5.5);

		// return time as a string
		return nd;
	},
};
