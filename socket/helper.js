var debug = require('debug')('ibeem');
var deviceData = require('../proxy').DeviceData;
var ibeemDevice = require('../proxy').IbeemDevice;
/**
 * 数据处理
 */
//接收数据
exports.rec_dev_data = function(data){
    var dataArr = data.toString().split('&');
    var deviceId = dataArr[0].slice(7, 12);
    debug("[dev_server] deviceId: " + deviceId);
    var temperature = parseFloat(dataArr[1].slice(3));
    debug("[dev_server] temperature: " + temperature);
    var humidity = parseFloat(dataArr[2].slice(3));
    debug("[dev_server] humidity: " + humidity);
    var illuminance = parseFloat(dataArr[3].slice(3));
    debug("[dev_server] illuminance: " + illuminance);
    var pm25 = parseFloat(dataArr[4].slice(5));
    debug("[dev_server] pm25: " + pm25);
    var co2 = parseFloat(dataArr[5].slice(4));
    debug("[dev_server] co2: " + co2);
    var device_data = {
        deviceId: deviceId,
        temperature: temperature,
        humidity: humidity,
        illuminance: illuminance,
        pm25: pm25,
        co2: co2,
        iscache: 0
    };
    ibeemDevice.selectByDid(device_data.deviceId, function(result){
        debug('[dev_server] ibeemDevice number: ' + result.length);
        if(!result.length){
            ibeemDevice.add(device_data.deviceId, function(result1){
                if(result1) debug('[dev_server] add new device success!');
            })
        }
    });
    deviceData.add(device_data, function(result){
        debug('[dev_server] deviceData addResult: ' + result);
    });
};
//设置数据上传周期数据
exports.set_dev_cycle = function(sock, data){
    var cycleStr = data.substring(5, data.length);
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var cycleBuf = Buffer.alloc(4);
    var cycle    = Buffer.alloc(4);
    mCodeBuf.writeIntLE(parseInt(data.substring(0, 2)), 0, 1);
    sCodeBuf.writeIntLE(parseInt(data.substring(2, 4)), 0, 1);
    cycleBuf.writeIntLE(parseInt(cycleStr), 0, 4);
    for(var i = 0; i < 4; ++i){
        cycle[i] = cycleBuf[3 - i];
    }
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, cycle]);
    debug('[dev_server] 设置数据上传周期数据cmd: ' + cmd.toString('hex'));
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
//获取校准参数数据
exports.get_dev_adjustment = function(sock, data){
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var dataBuf = Buffer.alloc(4);
    mCodeBuf.writeIntLE(parseInt(data.substring(0, 2)), 0, 1);
    sCodeBuf.writeIntLE(parseInt(data.substring(2, 4)), 0, 1);
    dataBuf.writeIntLE(0, 0, 4);
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, dataBuf]);
    debug('[dev_server] 获取校准参数数据cmd: ' + cmd.toString('hex'));
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
//接收校准参数数据
exports.rec_dev_adjustment = function(sock, data){
    var title = data.slice(0, 2).toString('hex');
    var a, b;
    switch(title){
    case "0301":
        a = data.slice(2, 6).readFloatLE().toFixed(1);
        b = data.slice(6, 10).readFloatLE().toFixed(1);
        debug('[dev_server] 接收温度校准参数: a = ' + a + ', b = ' + b);
        var ff = Buffer.alloc(1);
        var mCodeBuf = Buffer.alloc(1);
        var sCodeBuf = Buffer.alloc(1);
        ff.writeIntLE(0xff, 0, 1);
        mCodeBuf.writeIntLE(3, 0, 1);
        sCodeBuf.writeIntLE(1, 0, 1);
        var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
        try{
            sock.write(cmd);
        }catch(err){
            debug('[dev_server] sock error: ' + err);
        }
        break;
    case "0302":
        a = data.slice(2, 6).readFloatLE().toFixed(1);
        b = data.slice(6, 10).readFloatLE().toFixed(1);
        debug('[dev_server] 接收湿度校准参数: a = ' + a + ', b = ' + b);
        var ff = Buffer.alloc(1);
        var mCodeBuf = Buffer.alloc(1);
        var sCodeBuf = Buffer.alloc(1);
        ff.writeIntLE(0xff, 0, 1);
        mCodeBuf.writeIntLE(3, 0, 1);
        sCodeBuf.writeIntLE(2, 0, 1);
        var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
        try{
            sock.write(cmd);
        }catch(err){
            debug('[dev_server] sock error: ' + err);
        }
        break;
    case "0303":
        a = data.slice(2, 6).readFloatLE().toFixed(1);
        b = data.slice(6, 10).readFloatLE().toFixed(1);
        debug('[dev_server] 接收照度校准参数: a = ' + a + ', b = ' + b);
        var ff = Buffer.alloc(1);
        var mCodeBuf = Buffer.alloc(1);
        var sCodeBuf = Buffer.alloc(1);
        ff.writeIntLE(0xff, 0, 1);
        mCodeBuf.writeIntLE(3, 0, 1);
        sCodeBuf.writeIntLE(3, 0, 1);
        var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
        try{
            sock.write(cmd);
        }catch(err){
            debug('[dev_server] sock error: ' + err);
        }
        break;
    case "0304":
        a = data.slice(2, 6).readFloatLE().toFixed(1);
        b = data.slice(6, 10).readFloatLE().toFixed(1);
        debug('[dev_server] 接收PM25校准参数: a = ' + a + ', b = ' + b);
        var ff = Buffer.alloc(1);
        var mCodeBuf = Buffer.alloc(1);
        var sCodeBuf = Buffer.alloc(1);
        ff.writeIntLE(0xff, 0, 1);
        mCodeBuf.writeIntLE(3, 0, 1);
        sCodeBuf.writeIntLE(4, 0, 1);
        var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
        try{
            sock.write(cmd);
        }catch(err){
            debug('[dev_server] sock error: ' + err);
        }
        break;
    case "0305":
        a = data.slice(2, 6).readFloatLE().toFixed(1);
        b = data.slice(6, 10).readFloatLE().toFixed(1);
        debug('[dev_server] 接收CO2校准参数: a = ' + a + ', b = ' + b);
        var ff = Buffer.alloc(1);
        var mCodeBuf = Buffer.alloc(1);
        var sCodeBuf = Buffer.alloc(1);
        ff.writeIntLE(0xff, 0, 1);
        mCodeBuf.writeIntLE(3, 0, 1);
        sCodeBuf.writeIntLE(5, 0, 1);
        var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
        try{
            sock.write(cmd);
        }catch(err){
            debug('[dev_server] sock error: ' + err);
        }
        break;
    }
    return '_' + a + '_' + b;
}
//设置校准参数数据
exports.set_dev_adjustment = function(sock, data){
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var aBuf = Buffer.alloc(4);
    var bBuf = Buffer.alloc(4);
    var pos = data.lastIndexOf('_');
    mCodeBuf.writeIntLE(parseInt(data.substring(0, 2)), 0, 1);
    sCodeBuf.writeIntLE(parseInt(data.substring(2, 4)), 0, 1);
    aBuf.writeFloatLE(parseFloat(data.substring(5, pos + 1)), 0, 4);
    bBuf.writeFloatLE(parseFloat(data.substring(pos + 1, data.length)), 0, 4);
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, aBuf, bBuf]);
    debug('[dev_server] 设置校准参数数据cmd: ' + cmd.toString('hex'));
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
//获取系统时间数据
exports.get_dev_time = function(sock, data){
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var dataBuf = Buffer.alloc(4);
    mCodeBuf.writeIntLE(parseInt(data.substring(0, 2)), 0, 1);
    sCodeBuf.writeIntLE(parseInt(data.substring(2, 4)), 0, 1);
    dataBuf.writeIntLE(0, 0, 1);
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, dataBuf]);
    debug('[dev_server] 获取系统时间数据cmd: ' + cmd.toString('hex'));
    try{
    sock.write(cmd);
    }catch(err){
    debug('[dev_server] sock error: ' + err);
    }
};
//接收系统时间数据
exports.rec_dev_time = function(sock, data){
    var year = Buffer.from(data.slice(0, 2)).readIntBE(0, 2);
    var month = Buffer.from(data.slice(2, 4)).readIntBE(0, 2);
    var day = Buffer.from(data.slice(4, 6)).readIntBE(0, 2);
    var hour = Buffer.from(data.slice(6, 8)).readIntBE(0, 2);
    var minute = Buffer.from(data.slice(8, 10)).readIntBE(0, 2);
    var second = Buffer.from(data.slice(10, 12)).readIntBE(0, 2);
    debug('[dev_server] 系统时间: ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
    var ff = Buffer.alloc(1);
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    ff.writeIntLE(0xff, 0, 1);
    mCodeBuf.writeIntLE(4, 0, 1);
    sCodeBuf.writeIntLE(0, 0, 1);
    var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
    try{
    sock.write(cmd);
    }catch(err){
    debug('[dev_server] sock error: ' + err);
    }
};
//设置系统时间数据
exports.set_dev_time = function(sock, data){
    var dataArr = data.split('_');
    if(dataArr.length != 7) return;
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var yearBuf = Buffer.alloc(2);
    var monthBuf = Buffer.alloc(2);
    var dayBuf = Buffer.alloc(2);
    var hourBuf = Buffer.alloc(2);
    var minuteBuf = Buffer.alloc(2);
    var secondBuf = Buffer.alloc(2);
    var year = Buffer.alloc(2);
    var month = Buffer.alloc(2);
    var day = Buffer.alloc(2);
    var hour = Buffer.alloc(2);
    var minute = Buffer.alloc(2);
    var second = Buffer.alloc(2);
    mCodeBuf.writeIntLE(parseInt(dataArr[0].slice(0, 2)), 0, 1);
    sCodeBuf.writeIntLE(parseInt(dataArr[0].slice(2, 4)), 0, 1);
    yearBuf.writeIntLE(parseInt(dataArr[1]), 0, 2);
    monthBuf.writeIntLE(parseInt(dataArr[2]), 0, 2);
    dayBuf.writeIntLE(parseInt(dataArr[3]), 0, 2);
    hourBuf.writeIntLE(parseInt(dataArr[4]), 0, 2);
    minuteBuf.writeIntLE(parseInt(dataArr[5]), 0, 2);
    secondBuf.writeIntLE(parseInt(dataArr[6]), 0, 2);
    for(var i = 0; i < 2; ++i){
        year[i] = yearBuf[1 - i];
        month[i] = monthBuf[1 - i];
        day[i] = dayBuf[1 - i];
        hour[i] = hourBuf[1 - i];
        minute[i] = minuteBuf[1 - i];
        second[i] = secondBuf[1 - i];
    }
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, year, month, day, hour, minute, second]);
    debug('[dev_server] 设置系统时间数据cmd: ' + cmd.toString('hex'));
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
//设备连接校验时间
exports.conn_check_time = function(sock){
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    var yearBuf = Buffer.alloc(2);
    var monthBuf = Buffer.alloc(2);
    var dayBuf = Buffer.alloc(2);
    var hourBuf = Buffer.alloc(2);
    var minuteBuf = Buffer.alloc(2);
    var secondBuf = Buffer.alloc(2);
    var year = Buffer.alloc(2);
    var month = Buffer.alloc(2);
    var day = Buffer.alloc(2);
    var hour = Buffer.alloc(2);
    var minute = Buffer.alloc(2);
    var second = Buffer.alloc(2);
    var date = new Date();
    var sysYear = date.getFullYear();
    var sysMonth = date.getMonth() + 1;
    var sysDay = date.getDate();
    var sysHour = date.getHours();
    var sysMinute = date.getMinutes();
    var sysSecond = date.getSeconds();
    mCodeBuf.writeIntLE(4, 0, 1);
    sCodeBuf.writeIntLE(1, 0, 1);
    yearBuf.writeIntLE(parseInt(sysYear), 0, 2);
    monthBuf.writeIntLE(parseInt(sysMonth), 0, 2);
    dayBuf.writeIntLE(parseInt(sysDay), 0, 2);
    hourBuf.writeIntLE(parseInt(sysHour), 0, 2);
    minuteBuf.writeIntLE(parseInt(sysMinute), 0, 2);
    secondBuf.writeIntLE(parseInt(sysSecond), 0, 2);
    for(var i = 0; i < 2; ++i){
        year[i] = yearBuf[1 - i];
        month[i] = monthBuf[1 - i];
        day[i] = dayBuf[1 - i];
        hour[i] = hourBuf[1 - i];
        minute[i] = minuteBuf[1 - i];
        second[i] = secondBuf[1 - i];
    }
    var cmd = Buffer.concat([mCodeBuf, sCodeBuf, year, month, day, hour, minute, second]);
    debug('[dev_server] 校验系统时间数据cmd: ' + cmd.toString('hex'));
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
}
//离线数据个数数据
exports.rec_dev_num = function(sock, data){
    var num = Buffer.from(data).readIntBE(0, 4);
    debug('[dev_server] 离线数据个数: ' + num);
    var ff = Buffer.alloc(1);
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    ff.writeIntLE(0xff, 0, 1);
    mCodeBuf.writeIntLE(6, 0, 1);
    sCodeBuf.writeIntLE(0, 0, 1);
    var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf]);
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
//离线数据
exports.rec_dev_cacheData = function(sock, data){
    //获取离线数据第几条
    var dataNumBuf = Buffer.from(data.slice(0, 4));
    var dataNum = dataNumBuf.readIntBE(0, 4);
    debug('[dev_server] 离线数据第' + dataNum + '条');
    //获取离线数据时间
    var year = Buffer.from(data.slice(4, 6)).readIntBE(0, 2);
    var month = Buffer.from(data.slice(6, 7)).readIntBE(0, 1);
    var day = Buffer.from(data.slice(7, 8)).readIntBE(0, 1);
    var hour = Buffer.from(data.slice(8, 9)).readIntBE(0, 1);
    var minute = Buffer.from(data.slice(9, 10)).readIntBE(0, 1);
    var second = Buffer.from(data.slice(10, 11)).readIntBE(0, 1);
    var time = year.toString() + '-' + month.toString() + '-' + day.toString() + ' ' + hour.toString() + ':' + minute.toString() + ':' + second.toString();
    debug('[dev_server] 离线数据时间: ' + time);
    //获取环境数据
    var dataArr = data.slice(11, data.length).toString().split('&');
    var deviceId = dataArr[0].slice(7, 12);
    debug("[dev_server] 离线 deviceId: " + deviceId);
    var temperature = dataArr[1].slice(3);
    debug("[dev_server] 离线 temperature: " + temperature);
    var humidity = dataArr[2].slice(3);
    debug("[dev_server] 离线 humidity: " + humidity);
    var illuminance = dataArr[3].slice(3);
    debug("[dev_server] 离线 illuminance: " + illuminance);
    var pm25 = dataArr[4].slice(5);
    debug("[dev_server] 离线 pm25: " + pm25);
    var co2 = dataArr[5].slice(4);
    debug("[dev_server] 离线 co2: " + co2);

    var device_data = {
        deviceId: deviceId,
        temperature: temperature,
        humidity: humidity,
        illuminance: illuminance,
        pm25: pm25,
        co2: co2,
        iscache: 1,
        time: time
    };
    ibeemDevice.selectByDid(device_data.deviceId, function(result){
        debug('[dev_server] ibeemDevice number: ' + result.length);
        if(!result.length){
            ibeemDevice.add(device_data.deviceId, function(result1){
                if(result1) debug('[dev_server] add new device success!');
            })
        }
    });
    deviceData.add(device_data, function(result){
        debug('[dev_server] deviceData addResult: ' + result);
    });

    var ff = Buffer.alloc(1);
    var mCodeBuf = Buffer.alloc(1);
    var sCodeBuf = Buffer.alloc(1);
    ff.writeIntLE(0xff, 0, 1);
    mCodeBuf.writeIntLE(6, 0, 1);
    sCodeBuf.writeIntLE(1, 0, 1);
    var cmd = Buffer.concat([ff, mCodeBuf, sCodeBuf, dataNumBuf]);
    try{
        sock.write(cmd);
    }catch(err){
        debug('[dev_server] sock error: ' + err);
    }
};
