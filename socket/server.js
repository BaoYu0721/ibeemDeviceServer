var debug = require('debug')('ibeem');
var config = require('../config');
var net = require('net');
var helper = require('./helper');

//存储sock信息
var sockMap = new Map();
var addToSockMap = function(deviceId, sock){
  var value = {
    deviceSock: sock
  };
  sockMap.set(deviceId, value);
}
var delFromSockMap = function(sock){
  for(var key of sockMap.keys()){
    if(sockMap.get(key).deviceSock == sock){
      sockMap.delete(key);
      return;
    }
    if(sockMap.get(key).clientSock == sock){
      sockMap.get(key).clientSock = null;
    }
  }
}

var replyClientSock = function(sock, data){
  for(var key of sockMap.keys()){
    var deviceSock = sockMap.get(key).deviceSock;
    var clientSock = sockMap.get(key).clientSock;
    if(deviceSock == sock){
      if(clientSock){
        sockMap.get(key).clientSock.write(data);
        sockMap.get(key).clientSock = null;
      }
    }
  }
  sock.end();
}

exports.dev_server = function(){
  var server = net.createServer(function(sock){
    debug('[dev_server] connect ' + sock.remoteAddress + ':' + sock.remotePort);
    helper.conn_check_time(sock);
    sock.on('data', function(data){
      var dataBuf = Buffer.from(data);
      var ack = dataBuf.slice(0, 1).toString('hex');
      if(ack == "ff"){
        var title = dataBuf.slice(1, 3).toString('hex');
        switch(title){
          case "0101":
            replyClientSock(sock, title);
            debug('[dev_server] ACK: 0200 设置数据上传周期成功');
            break;
          case "0201":
          case "0202":
          case "0203":
          case "0204":
          case "0205":
            replyClientSock(sock, title);
            debug('[dev_server] ACK: 0201 设置校准参数成功');
            break;
          case "0401":
            replyClientSock(sock, title);
            debug('[dev_server] ACK: 0501 设置系统时间成功');
            break;
        }
        return;
      }
      var taskCome = dataBuf.slice(0, 4).toString();
      if(taskCome == "task"){
        var dataArr = dataBuf.toString().split('_');
        var deviceId = dataArr[1];
        debug('[dev_server] task deviceId: ' + deviceId);
        var title = dataArr[2];
        var argument = dataBuf.slice(11, dataBuf.length).toString();
        switch(title){
        case "0101":
          if(sockMap.get(deviceId)){
            sockMap.get(deviceId).clientSock = sock;
            helper.set_dev_cycle(sockMap.get(deviceId).deviceSock, argument);
          }
          else{
            debug('[dev_server] Info: ' + deviceId + ' 设备已断开');
          }
          break;
        case "0201":
        case "0202":
        case "0203":
        case "0204":
        case "0205":
          if(sockMap.get(deviceId)){
            sockMap.get(deviceId).clientSock = sock;
            helper.set_dev_adjustment(sockMap.get(deviceId).deviceSock, argument);
          }
          else{
            debug('[dev_server] Info: ' + result[i].device_id + ' 设备已断开');
          }
          break;
        case "0301":
        case "0302":
        case "0303":
        case "0304":
        case "0305":
          if(sockMap.get(result[i].device_id)){
            sockMap.get(deviceId).clientSock = sock;
            helper.get_dev_adjustment(sockMap.get(deviceId).deviceSock, argument);
          }
          else{
            debug('[dev_server] Info: ' + result[i].device_id + ' 设备已断开');
          }
          break;
        case "0400":
          if(sockMap.get(result[i].device_id)){
            sockMap.get(deviceId).clientSock = sock;
            helper.get_dev_time(sockMap.get(deviceId).deviceSock, argument);
          }
          else{
            debug('[dev_server] Info: ' + result[i].device_id + ' 设备已断开');
          }
          break;
        case "0401":
          if(sockMap.get(result[i].device_id)){
            sockMap.get(deviceId).clientSock = sock;
            helper.set_dev_time(sockMap.get(deviceId).deviceSock, argument);
          }
          else{
            debug('[dev_server] Info: ' + result[i].device_id + ' 设备已断开');
          }
          break;
        }
        return;
      }
      var title = dataBuf.slice(0, 2).toString('hex');
      var recData = dataBuf.slice(2, dataBuf.length);
      debug('[dev_server] data: ' + recData.toString());
      switch(title){
      case "0100":
        debug('[dev_server] 实时数据: ' + recData.toString());
        var dataArr = data.toString().split('&');
        if(dataArr.length != 6 || recData.toString().slice(0, 3) != "IEQ") break;
        var deviceId = dataArr[0].split('_')[2];
        if(!sockMap.get(deviceId)){
          addToSockMap(deviceId, sock);
        }
        helper.rec_dev_data(recData);
        break;
      case "0301":
      case "0302":
      case "0303":
      case "0304":
      case "0305":
        var resClientData = helper.rec_dev_adjustment(sock, data);
        replyClientSock(sock, title + resClientData);
        break;
      case "0400":
        helper.rec_dev_time(sock, recData);
        break;
      case "0500":
        helper.rec_dev_num(sock, recData);
        break;
      case "0601":
        var envData = recData.slice(11, recData.length);
        if(!envData){
          break;
        }
        debug('[dev_server] 离线数据: ' + envData.toString());
        var dataArr = envData.toString().split('&');
        if(dataArr.length != 6 || envData.toString().slice(0, 3) != "IEQ") break;
        var deviceId = dataArr[0].split('_')[2];
        if(!sockMap.get(deviceId)){
          addToSockMap(deviceId, sock);
        }
        helper.rec_dev_cacheData(sock, recData);
        break;
      default:
        debug('[dev_server] 实时数据: ' + recData.toString());
        var dataArr = data.toString().split('&');
        if(dataArr.length != 6 || recData.toString().slice(0, 3) != "IEQ") break;
        var deviceId = dataArr[0].split('_')[2];
        if(!sockMap.get(deviceId)){
          addToSockMap(deviceId, sock);
        }
        helper.rec_dev_data(recData);
        break;
      }
    });
    sock.on('close', function(){
      debug('[dev_server] connection close ' + sock.remoteAddress);
      delFromSockMap(sock);
    });
    sock.on('error', function(err){
      debug('[dev_server] Error: ' + err);
      delFromSockMap(sock);
      sock.destroy();
    })
    sock.setTimeout(610000, ()=>{
      debug('[dev_server] Timeout: ' + sock.remoteAddress);
      delFromSockMap(sock);
      sock.destroy();
    });
  });

  server.listen(config.dev_server_port);
};
