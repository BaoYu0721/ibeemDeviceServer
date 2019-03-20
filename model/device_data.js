var deviceDataSqlMap = {
    add: 'insert into device_data(device_id, temperature, humidity, illuminance, pm25, co2, iscache, time) values(?, ?, ?, ?, ?, ?, ?, ?)',
    selectByTime: 'select * from device_data where device_id = ? and time > ? and time < ?',
};

module.exports = deviceDataSqlMap;