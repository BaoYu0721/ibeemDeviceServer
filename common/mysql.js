var mysql = require('mysql');
var config = require('../config');
var debug = require('debug')('ibeem');


var pool = mysql.createPool(config.mysql);

if(pool){
    debug('[mysql] createPool');
}

module.exports = pool;