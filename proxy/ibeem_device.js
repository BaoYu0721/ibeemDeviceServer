var IbeemDeviceSqlMap = require('../model').IbeemDeviceSqlMap;
var pool = require('../common/mysql');

module.exports = {
    add: function(deviceId, callback){
        pool.query(IbeemDeviceSqlMap.add, [deviceId, new Date(), new Date()], function(error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    selectByDid: function(deviceId, callback){
        pool.query(IbeemDeviceSqlMap.selectByDid, [deviceId], function(error, result){
            if(error) throw error;
            callback(result);
        })
    },
}