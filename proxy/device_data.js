var DeviceDataSqlMap = require('../model').DeviceDataSqlMap;
var pool = require('../common/mysql');

module.exports = {
    add: function(data, callback){
        pool.query(DeviceDataSqlMap.add, [data.deviceId, data.temperature, data.humidity, data.illuminance, data.pm25, data.co2, data.iscache, data.time ? data.time : new Date()], function(error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    selectByTime: function(data, callback){
        pool.query(DeviceDataSqlMap.selectByTime, [data.deviceId, data.sTime, data.eTime], function(error, result){
            if(error) throw error;
            callback(result);
        })
    },
}