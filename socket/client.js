var net = require('net');
var debug = require('debug')('ibeem');
var config = require('../config');

exports.dev_client = function(reqData, callback){
    var client = new net.Socket();
    client.connect(config.dev_server_port, () => {
            debug('[dev_client] item: ' + reqData.item);
            if(reqData.item == 'set_cycle'){
                var data = 'task_' + reqData.deviceId + '_0101_' + reqData.cycle;
                client.write(data);
            }else if(reqData.item == 'set_time'){

                var date = new Date(reqData.date);
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var data = 'task_' + reqData.deviceId + '_0401_' + year + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + second;
                client.write(data);
            }else if(reqData.item == 'set_argument'){
                var data = 'task_' + reqData.deviceId + '_' + reqData.type + '_' + reqData.argument.arg1 + '_' + reqData.argument.arg2;
                client.write(data);
            }else if(reqData.item == 'get_argument'){
                var data = 'task_' + reqData.deviceId + '_' + reqData.type;
                client.write(data);
            }
        }
    );

    client.on('data', function(data){
        if(Buffer.from(data).slice(0, 2).toString('hex') == '0401') return;
        console.log(data.toString())
        var resData = {
            data: data.toString(),
            code: 200
        };
        callback(resData);
        client.end();
    });
    client.on('timeout', function(){
        var resData = {
            code: 400
        };
        callback(resData);
        client.end();
    })
    client.setTimeout(10000);
    client.setEncoding('utf8');
}
