#!/usr/bin/env node
var cluster = require('cluster');
var debug = require('debug')('ibeem');
var httpServer = require('./http_server');
var sockServer = require('./socket_server');


if(cluster.isMaster){
  cluster.fork();
  cluster.on('online', function(worker) {
    debug('[cluster] Worker ' + worker.process.pid + ' is online');
  });
  cluster.on('exit', function(worker, code, signal) {
    debug('[cluster] Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    debug('[cluster] Starting a new worker');
    cluster.fork();
  });
  httpServer.http_server();
}else{
  sockServer.socket_server();
}
