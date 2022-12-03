const floodModel = require('../models/flood');
const Config = require('../configuration/config');

module.exports = {
	list_dist: async (req, res, next) => {
		try {
			let { state_id } = req.value.params;
			await floodModel
				.list_dist(state_id)
				.then(async function (data) {
					if (data.length > 0) {
						res
							.status(200)
							.json({
								status: 1,
								message: 'Data Fetch Successfully',
								data: data,
							})
							.end();
					} else {
						res
							.status(400)
							.json({
								status: 2,
								message: 'Error Occers While Fetching Data.',
								data: [],
							})
							.end();
					}
				})
				.catch((err) => {
					console.log('err =>', err);
					res
						.status(400)
						.json({
							status: 3,
							message: Config.errorText.value,
						})
						.end();
				});
		} catch (err) {
			console.log('err =>', err);
			res
				.status(400)
				.json({
					status: 3,
					message: Config.errorText.value,
				})
				.end();
		}
	},
	list_cities: async (req, res, next) => {
		try {
			let { state_id, dist_id } = req.value.params;
			await floodModel
				.list_cities(state_id, dist_id)
				.then(async function (data) {
					if (data.length > 0) {
						res
							.status(200)
							.json({
								status: 1,
								message: 'Data Fetch Successfully',
								data: data,
							})
							.end();
					} else {
						res
							.status(400)
							.json({
								status: 2,
								message: 'Error Occers While Fetching Data.',
								data: [],
							})
							.end();
					}
				})
				.catch((err) => {
					console.log('err =>', err);
					res
						.status(400)
						.json({
							status: 3,
							message: Config.errorText.value,
						})
						.end();
				});
		} catch (err) {
			console.log('err =>', err);
			res
				.status(400)
				.json({
					status: 3,
					message: Config.errorText.value,
				})
				.end();
		}
	},
	list_state: async (req, res, next) => {
		try {
			await floodModel
				.list_state()
				.then(async function (data) {
					if (data.length > 0) {
						res
							.status(200)
							.json({
								status: 1,
								message: 'Data Fetch Successfully',
								data: data,
							})
							.end();
					} else {
						res
							.status(400)
							.json({
								status: 2,
								message: 'Error Occers While Fetching Data.',
								data: [],
							})
							.end();
					}
				})
				.catch((err) => {
					console.log('err =>', err);
					res
						.status(400)
						.json({
							status: 3,
							message: Config.errorText.value,
						})
						.end();
				});
		} catch (err) {
			console.log('err =>', err);
			res
				.status(400)
				.json({
					status: 3,
					message: Config.errorText.value,
				})
				.end();
		}
	},
	get_flood_data: async (req, res, next) => {
		try {
			const { state_id, dist_id, city_id, date_from, date_to, latitude, longitude } =
				req.value.body;
			let query = {
				state_id: 0,
				dist_id: 0,
				city_id: 0,
				date_from: '',
				date_to: '',
				latitude: '',
				longitude: '',
			};
			if (state_id && dist_id) {
				query.state_id = state_id;
				query.dist_id = dist_id;
				if (city_id && city_id > 0) {
					query.city_id = city_id;
				}
			}
			if (latitude && longitude) {
				query.latitude = latitude;
				query.longitude = longitude;
			}
			if (date_from) {
				query.date_from = date_from;
			}
			if (date_to) {
				query.date_to = date_to;
			}

			await floodModel
				.get_flood_data(query)
				.then(async function (data) {
					//console.log("this is data : ",data);
					if (data.length > 0) {
						res
							.status(200)
							.json({
								status: 1,
								message: 'Data Fetch Successfully',
								data: data,
							})
							.end();
					} else {
						res
							.status(400)
							.json({
								status: 2,
								message: 'No data Found.',
								data: [],
							})
							.end();
					}
				})
				.catch((err) => {
					console.log('err =>', err);
					res
						.status(400)
						.json({
							status: 3,
							message: Config.errorText.value,
						})
						.end();
				});
		} catch (err) {
			console.log('err =>', err);
			res
				.status(400)
				.json({
					status: 3,
					message: Config.errorText.value,
				})
				.end();
		}
	},
};
