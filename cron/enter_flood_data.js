const db = require('../configuration/dbConn');

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

//const path_1 = "./customer_template.xls";
const path = './flood.xls';
try {
	node_xj = require('xls-to-json-lc');
	node_xj(
		{
			input: path, // input xls
			output: null, // output json
			sheet: 'flood', // specific sheetname
			lowerCaseHeaders: true,
		},
		function (err, result) {
			if (err) {
				console.error('Error from package ===>', err);
			} else {
				let count = 0;
				//console.log('=======>', result);
				result.map((f_data) => {
					let floodObj = {
						date_of_flood: f_data.date_of_flood,
						state: entities.encode(f_data.states),
						district: entities.encode(f_data.district),
						city: entities.encode(f_data.city),
						latitude: f_data.latitude,
						longitude: f_data.longitude,
						links: f_data.links,
					};
					db.any(
						`INSERT INTO tbl_flood_details (date_of_flood,state,district,city,latitude,longitude,links) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
						[
							floodObj.date_of_flood,
							floodObj.state,
							floodObj.district,
							floodObj.city,
							floodObj.latitude,
							floodObj.longitude,
							floodObj.links,
						]
					)
						.then((data) => {
							if (data.length > 0) {
								count++;
								console.log(`Total Data Added : ${count}`);
							}
						})
						.catch((err) => {
							console.log('this is error :', err);
						});
				});

				// if (count > 0) {
				// 	console.log(`Total Data Added : ${count}`);
				// } else {
				// 	console.log('No data found');
				// }
			}
		}
	);
} catch (err) {
	console.log('Processing error : ', err);
}
