const db = require('../configuration/dbConn');
const common = require('../controllers/common');

module.exports = {
	check_state: async (state_id) => {
		return new Promise(function (resolve, reject) {
			let sql = `SELECT state_id from state WHERE state_id = $1 AND status = 'Active'`;
			let arr = [state_id];
			db.any(sql, arr)
				.then(function (data) {
					if (data.length > 0 && data[0].state_id > 0) {
						resolve({ success: true });
					} else {
						resolve({ success: false });
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	check_district: async (state_id, district_id) => {
		return new Promise(function (resolve, reject) {
			let sql = `SELECT districtid from district WHERE state_id = $1 AND districtid = $2 AND district_status = 'Active'`;
			let arr = [state_id, district_id];
			db.any(sql, arr)
				.then(function (data) {
					if (data.length > 0 && data[0].districtid > 0) {
						resolve({ success: true });
					} else {
						resolve({ success: false });
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	check_city: async (state_id, district_id, city_id) => {
		return new Promise(function (resolve, reject) {
			let sql = `SELECT id from city WHERE state_id = $1 AND districtid = $2 AND id = $3 AND  status = 'Active'`;
			let arr = [state_id, district_id, city_id];
			db.any(sql, arr)
				.then(function (data) {
					if (data.length > 0 && data[0].id > 0) {
						resolve({ success: true });
					} else {
						resolve({ success: false });
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	list_dist: async (state_id) => {
		//console.log("this is state id : ",state_id);
		return new Promise(function (resolve, reject) {
			let sql = `SELECT districtid,district_title from district WHERE state_id = $1 AND district_status = 'Active' ORDER BY district_title ASC`;
			let arr = [state_id];
			db.any(sql, arr)
				.then(function (data) {
					if (data.length > 0) {
						resolve(data);
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	list_cities: async (state_id, dist_id) => {
		return new Promise(function (resolve, reject) {
			let sql = `SELECT id,name from city WHERE state_id = $1 AND districtid = $2 AND status = 'Active' ORDER BY name ASC`;
			let arr = [state_id, dist_id];
			db.any(sql, arr)
				.then(function (data) {
					if (data.length > 0) {
						resolve(data);
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	list_state: async () => {
		return new Promise(function (resolve, reject) {
			let sql = `SELECT state_id,state_title from state WHERE status = 'Active' ORDER BY state_title ASC`;
			db.any(sql)
				.then(function (data) {
					if (data.length > 0) {
						resolve(data);
					}
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
	get_flood_data: async (query) => {
		return new Promise(function (resolve, reject) {
			//console.log("hello am in :",query);
			let condition = '';
			let sql = '';
			if (query.date_from != '') {
				condition += `AND tbl_flood_details.date_of_flood >= '${query.date_from}'`;
			}
			if (query.date_to != '') {
				condition += `AND tbl_flood_details.date_of_flood <= '${query.date_to}'`;
			}

			if (query.state_id > 0 && query.dist_id > 0 && query.city_id > 0) {
				sql = `SELECT * FROM  tbl_flood_details 
                LEFT JOIN city on LOWER(tbl_flood_details.city) = LOWER(city.name)
                WHERE city.state_id = ${query.state_id} AND city.districtid = ${query.dist_id} AND city.id = ${query.city_id} AND city.status = 'Active' ${condition} ORDER BY tbl_flood_details.id DESC`;
			} else if (query.state_id > 0 && query.dist_id > 0) {
				sql = `SELECT * FROM  tbl_flood_details
                LEFT JOIN district on LOWER(tbl_flood_details.district) = LOWER(district.district_title)
                WHERE district.state_id = ${query.state_id} AND district.districtid = ${query.dist_id} AND district.district_status = 'Active' ${condition} ORDER BY tbl_flood_details.id DESC`;
			}
			if (query.latitude != '' && query.longitude != '') {
				sql = `SELECT * FROM tbl_flood_details WHERE latitude = '${query.latitude}' AND longitude = '${query.longitude}' ${condition} ORDER BY tbl_flood_details.id DESC`;
			}
			db.any(sql)
				.then(function (data) {
					resolve(data);
				})
				.catch(function (err) {
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject('Error in connection', error);
				});
		});
	},
};
