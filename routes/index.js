var express = require('express');
var sockClient = require('../socket/client');
var router = express.Router();

router.post('/ibeem/device/set_cycle', function(req, res) {
    var data = req.body;
    if(!data.item || !data.deviceId || !data.cycle){
        return res.send({
            code: 401
        });
    }
    if(data.deviceId.length != 5 || !/^\d*$/.test(data.cycle)){
        return res.send({
            code: 401
        });
    }
    sockClient.dev_client(data, function(resData){
        res.send(resData);
    });
});

router.post('/ibeem/device/set_time', function(req, res) {
    var data = req.body;
    if(!data.item || !data.deviceId || !data.date){
        return res.send({
            code: 401
        });
    }
    if(data.deviceId.length != 5 || new Date(data.date).toString() == "Invalid Date"){
        return res.send({
            code: 401
        });
    }
    sockClient.dev_client(data, function(resData){
        res.send(resData);
    });
});

router.post('/ibeem/device/set_argument', function(req, res) {
    var data = req.body;
    if(!data.item || !data.deviceId || !data.type || !data.argument){
        return res.send({
            code: 401
        });
    }
    if(data.deviceId.length != 5 || data.type.length != 4 || !/^[\d|\.]*$/.test(data.argument.arg1) || !/^[\d|\.]*$/.test(data.argument.arg2)){
        return res.send({
            code: 401
        });
    }
    sockClient.dev_client(data, function(resData){
        res.send(resData);
    });
});

router.post('/ibeem/device/get_argument', function(req, res) {
    var data = req.body;
    if(!data.item || !data.deviceId){
        return res.send({
            code: 401
        });
    }
    if(data.deviceId.length != 5 || data.type.length != 4){
        return res.send({
            code: 401
        });
    }
    sockClient.dev_client(data, function(resData){
        res.send(resData);
    });
});

module.exports = router;
