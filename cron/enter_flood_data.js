const db = require('../configuration/dbConn');
const NodeGeocoder = require('node-geocoder');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const options = {
	provider: 'openstreetmap',
};

let geocoder = NodeGeocoder(options);
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
				let flood_arr = [];
				result.map(async (f_data) => {
					if (f_data.city != '') {
						let cty_arr = f_data.city.split(',');
						//console.log("cty length ",cty_arr.length);
						if (cty_arr.length > 1) {
							for (i in cty_arr) {
								await geocoder.geocode(`${cty_arr[i]}`).then((res) => {
									//console.log('this is resp 1 :', res);
									let { latitude, longitude } = res;

									let floodObj = {
										date_of_flood: f_data.date_of_flood,
										state: entities.encode(f_data.state),
										district: entities.encode(f_data.district),
										city: entities.encode(cty_arr[i]),
										latitude: latitude,
										longitude: longitude,
										links: f_data.links,
									};
									flood_arr.push(floodObj);
								});
							}
						} else {
							let floodObj = {
								date_of_flood: f_data.date_of_flood,
								state: entities.encode(f_data.state),
								district: entities.encode(f_data.district),
								city: entities.encode(f_data.city),
								latitude: f_data.latitude,
								longitude: f_data.longitud,
								links: f_data.links,
							};
							flood_arr.push(floodObj);
						}
					} else {
						let floodObj = {
							date_of_flood: f_data.date_of_flood,
							state: entities.encode(f_data.state),
							district: entities.encode(f_data.district),
							city: entities.encode(f_data.city),
							latitude: f_data.latitude,
							longitude: f_data.longitud,
							links: f_data.links,
						};
						flood_arr.push(floodObj);
					}
					console.log("flood_arr length : ",flood_arr.length );
					// flood_arr.map((floodObj) => {
					// 	db.any(
					// 		`INSERT INTO tbl_flood_details (date_of_flood,state,district,city,latitude,longitude,links) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
					// 		[
					// 			floodObj.date_of_flood,
					// 			floodObj.state,
					// 			floodObj.district,
					// 			floodObj.city,
					// 			floodObj.latitude,
					// 			floodObj.longitude,
					// 			floodObj.links,
					// 		]
					// 	)
					// 		.then((data) => {
					// 			if (data.length > 0) {
					// 				count++;
					// 				console.log(`Total Data Added : ${count}`);
					// 			}
					// 		})
					// 		.catch((err) => {
					// 			console.log('this is error :', err);
					// 		});
					// });
				});
			}
		}
	);
} catch (err) {
	console.log('Processing error : ', err);
}
