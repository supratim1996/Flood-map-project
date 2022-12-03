const Joi = require('joi');

module.exports = {
	validateBody: (schema) => {
		return (req, res, next) => {
			const result = Joi.validate(req.body, schema, { abortEarly: false });
			if (result.error) {
				let err_msg = {};
				for (let counter in result.error.details) {
					let k = result.error.details[counter].context.key;
					let val = result.error.details[counter].message;
					err_msg[k] = val;
				}
				let return_err = { status: 2, errors: err_msg };
				return res.status(400).json(return_err);
			}

			if (!req.value) {
				req.value = {};
			}
			req.value['body'] = result.value;
			next();
		};
	},
	validateParam: (schema) => {
		return (req, res, next) => {
			const result = Joi.validate(req.params, schema);
			if (result.error) {
				let return_err = { status: 2, errors: 'Invalid argument' };
				return res.status(400).json(return_err);
			}

			if (!req.value) {
				req.value = {};
			}
			req.value['params'] = result.value;
			next();
		};
	},
	schemas: {
		list_dist: Joi.object().keys({
			state_id: Joi.number().required(),
		}),
		list_cities: Joi.object().keys({
			state_id: Joi.number().required(),
			dist_id: Joi.number().required(),
		}),
		get_flood_data: Joi.object().keys({
			state_id: Joi.number().optional(),
			dist_id: Joi.number().optional(),
			city_id: Joi.number().optional(),
			latitude: Joi.string().optional(),
			longitude: Joi.string().optional(),
			date_from: Joi.string().required(),
			date_to: Joi.string().required(),
		}),
	},
};
