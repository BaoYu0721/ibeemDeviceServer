# ibeem设备服务器
> 程序安装运行

+ 安装依赖
```
npm i
```
+ 安装pm2
```
sudo npm install pm2 -g 
```
+ Development
```
npm start
```
+ Deploy
```
cd ./bin & pm2 start ./server.js
```