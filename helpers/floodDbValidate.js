const floodModel = require('../models/flood');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const common = require('../controllers/common');
const Config = require('../configuration/config');
const toTimestamp = (strDate) => {
	const dt = Date.parse(strDate);
	return dt / 1000;
};
module.exports = {
	list_dist: async (req, res, next) => {
		try {
			const { state_id } = req.value.params;
			let err = {};
			let check_state = await floodModel.check_state(state_id);
			if (!check_state.success) {
				err.state = `Please enter valid State.`;
			}
			if (common.isEmptyObj(err)) {
				next();
			} else {
				let return_err = {
					status: 2,
					errors: err,
				};
				return res.status(400).json(return_err);
			}
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
			const { state_id, dist_id } = req.value.params;
			let err = {};
			let check_state = await floodModel.check_state(state_id);
			if (!check_state.success) {
				err.state = `Please enter valid State.`;
			}
			let check_district = await floodModel.check_district(state_id, dist_id);
			if (!check_district.success) {
				err.district = `Please enter valid District.`;
			}
			if (common.isEmptyObj(err)) {
				next();
			} else {
				let return_err = {
					status: 2,
					errors: err,
				};
				return res.status(400).json(return_err);
			}
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
			let err = {};
			if (state_id && state_id > 0 && dist_id && dist_id > 0) {
				let check_state = await floodModel.check_state(state_id);
				if (!check_state.success) {
					err.state = `Please enter valid State.`;
				}
				let check_district = await floodModel.check_district(state_id, dist_id);
				if (!check_district.success) {
					err.district = `Please enter valid District.`;
				}
				if (city_id && city_id > 0) {
					let check_city = await floodModel.check_city(state_id, dist_id, city_id);
					if (!check_city.success) {
						err.district = `Please enter valid City.`;
					}
				}
			} else if (latitude && latitude != '' && longitude && longitude != '') {
				//Do Nothing
			} else {
				err.flood_data = `Invalid Data`;
			}
			if (date_from && date_from != '' && date_to && date_to != '') {
				let new_date_from = new Date(date_from);
				let current_date = new Date(common.currentDateTime());
				let new_to_date = new Date(date_to);

				if (new_date_from.getTime() > new_to_date.getTime()) {
					err.date = `Invalid Time Interval`;
				}

				if (new_date_from.getTime() > current_date.getTime()) {
					err.date = `From Date Can Not Be Greater Than Current Date`;
				}
				if (new_to_date.getTime() > current_date.getTime()) {
					err.date = `To Date Can Not Be Greater Than Current Date`;
				}
			}
			if (common.isEmptyObj(err)) {
				next();
			} else {
				let return_err = {
					status: 2,
					errors: err,
				};
				return res.status(400).json(return_err);
			}
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
