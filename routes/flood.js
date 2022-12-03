const express = require('express');
const router = require('express-promise-router')();
const { validateBody, validateParam, schemas } = require('../helpers/floodValidate');
const validateDbBody = require('../helpers/floodDbValidate');
const floodController = require('../controllers/flood');

/**
 * @desc List All States
 * @return json
 */
router.route('/list_state').get(floodController.list_state);
/**
 * @desc List All Districts
 * @params state_id
 * @return json
 */
router
	.route('/list_dist/:state_id')
	.get(validateParam(schemas.list_dist), validateDbBody.list_dist, floodController.list_dist);
/**
 * @desc List All cities by district
 * @params state_id , district_id
 * @return json
 */
router
	.route('/list_cities/:state_id/:dist_id')
	.get(validateParam(schemas.list_cities), validateDbBody.list_cities, floodController.list_cities);

router
	.route('/get_flood_data')
	.post(
		validateBody(schemas.get_flood_data),
		validateDbBody.get_flood_data,
		floodController.get_flood_data
	);

module.exports = router;
