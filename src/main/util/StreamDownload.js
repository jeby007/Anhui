import * as path from 'path';
import * as fs from 'fs';
import config from '../config'
const request = require('request');
import log4js from '../lib/log-config'
const isOnline = require('is-online');
const logger = log4js.getLogger();



const StreamDownload = {

  /*
 * options
 *        =>baseurl 
 *        =>other 保存路径
 *        =>basename 保存文件名
 *        =>basename 保存文件名
 *
 *        =>showProgress 进度
 *        =>success 成功
 *        =>error 失败


        服务端防止重复请求
 *
 * */
  optionsA: {}, //防止重复请求
  down: function (options) {

    if (!config.requestEnd) {
      return ;
    }
    config.requestEnd = false;
    this.optionsA = options;
     //定义下载函数
     let downConfig = {
          files: files,
          totalBytes: 0,
          receivedBytes: 0,
          downSpeed: '0k/s',
          timerBytes: 0,
          interval: {},
          onlineInteval: {},
          downPercentage: 0,
          on: { 
              progress: (receivedBytes, totalBytes, downPercentage, downSpeed) => {
                  options.showProgress({receivedBytes, totalBytes, downPercentage, downSpeed});
              },
              end: (inputFiles)=> {
                  //下载成功
                  options.success(inputFiles)
              },
              error: (e)=> {
                  //下载异常
                  options.error('下载出现异常', e);
              }
          }
     }

     
     //获取文件urls
     let files = this.getFieUrls(options);
     //计算文件总大小
     this.countFileTotal(files).then(total => {
           //拿到文件总长度
           //将总长度参数赋给下载参数
           downConfig.totalBytes = total;
           //获取已下载量
           files = this.getReceivedBytes(files);
           //计算总的已下载量
           files.forEach(file => {
              downConfig.receivedBytes += file.receivedBytes;
           });
           //将files赋给下载参数
           downConfig.files = files;
           let downPercentage = '0%';
           if (total > 0) {
              //计算已下载百分比
              downPercentage = ((downConfig.receivedBytes / total) * 100).toFixed(1) + '%';
           } 
           downConfig.on.progress(downConfig.receivedBytes, total, downPercentage, options.downSpeed);
           //下载文件
          this.downFile(downConfig);
     });
  },

  /*
      检测网络是否正常
  */
  checkOnline: function(options) {
    let _self = this;
      options.onlineInteval = setInterval(function() {
          isOnline().then(online => {
            if(!online){
                logger.error('==================', '网络异常');
                options.on.error('Houston we have a problem');
            } else {
              
              /*_self.down(_self.optionsA);*/
            }
         });
      }, 2000);
  },
  /*
      计算文件总大小
  */
  countFileTotal: function(files) {
        let promiseArr = [];
        let total = 0;
        for(var i = 0; i < files.length; i++) {
            promiseArr.push(this.countFile(files[i]))
        }
       return Promise.all(promiseArr).then(function (res) {
             res.forEach(size => {
                total += size;
             });
             return total;
         })
  },

  /**
      计算单个文件大小
  */
  countFile: function(file) {
      return new Promise((resolve) => {
           let req = request({method: 'HEAD', uri: file.downurl});
            req.on('response', (resp) => {
               let size =  (resp.statusCode == 200) ? parseInt(resp.headers['content-length'], 10) : 0;
                resolve(size);
            }); 
            req.on('error', (e) => {
                logger.error('计算文件长度http请求出错，error:', e);
                resolve(0);
            });
      });
  },

  //获取下载的url
  getFieUrls: function(options) {
      let files = [];
      //旧版本
      let oldVersion = options.oldVersion;
      //新版本
      let newVersion = options.newVersion;

       //判断当前版本与新版本、版本差
      if (typeof(oldVersion) == 'undefined' || (newVersion - oldVersion).toFixed(2) > 0.01 ) {
          let file = { downurl: '', receivedBytes: 0 , baseDir: options.baseDir}
          file.downurl = options.baseUrl;
          files[0] = file;
          let otherfile = { downurl: '', receivedBytes: 0 , baseDir: options.baseDir}
          otherfile.downurl = options.otherUrl; 
          files[1] = otherfile;
      } else { 
          //更新小版本，通过updateurl下载
          let file = { downurl: '', receivedBytes: 0 , baseDir: options.baseDir}
          file.downurl = options.updateUrl;
          files[0] = file;
      }
      return files;
  },

  //获取每个文件的已下载量
  getReceivedBytes: function(files) {
      files.forEach(file => {
         //判断文件是否已下载
          try {
              //截取文件名
              let fileName = file.downurl.substring(file.downurl.lastIndexOf('/') + 1);
              //文件保存路径
              let inputFile = path.join(file.baseDir, fileName);
              //如果文件已存在读取文件信息
              let stats = fs.statSync(inputFile);
              //如果已下载文件长度跟踪长度一致
              file.receivedBytes = stats.size;
          } catch (err) {
              logger.info('文件不存在，开始下载');
          }
      }); 
     return files; 
  },


  getSpeed: function(options) {
      options.interval = setInterval(function() {
      var bytes = options.receivedBytes - options.timerBytes;
        if (bytes > 0) {
            var speed = bytes / 1024;
            options.downSpeed = speed < 1024 ? speed.toFixed(1) + 'k/s' : (speed /1024).toFixed(1) + 'm/s';
          }
          options.timerBytes = options.receivedBytes;
      }, 1000);
  },

  /*
    下载文件
  */
  downFile: function(options){
      let i = 0;
      let inputFiles = [];

      this.checkOnline(options);
      this.getSpeed(options);
      options.files.forEach(file => {
          //创建requst请求
          const req = request({method: 'GET', uri: file.downurl});
          var url = file.downurl;
          //截取文件名
          let fileName = url.substring(url.lastIndexOf('/') + 1);
          //文件保存路径
          let inputFile = path.join(file.baseDir, fileName);


          let rs = fs.createWriteStream(inputFile, {
                    start: file.receivedBytes,
                    flags: file.receivedBytes > 0 ? 'a+' : 'w' //写文件，当已经有部分下载时，追加
                  })
            //输出文件流
          req.pipe(rs); 

          /*
              监听断流
          */
         /* rs.on('close', () => {
              //如果接收的字节数小于总字节数
              if (options.receivedBytes <= options.totalBytes) {
                  config.requestEnd = true;
                  this.down(this.optionsA);
              }
          });*/

        //
          //如果已经下载一部分，本次从上次下载的长度开始下载
          if (file.receivedBytes > 0) {
             //读远程需下载文件，从已下载的字节开始
             req.headers['Range'] = 'bytes=' + file.receivedBytes + '-'; 
          }

          /*
              响应
          */
          req.on('response', (resp) => {
              console.log('=========================', resp.statusCode);
          });

          //监听文件流
          req.on('data', (chunk) => {
              options.receivedBytes += chunk.length;
              let downPercentage = '0%';
              if (options.totalBytes > 0) {
                  let  percentage = ((options.receivedBytes / options.totalBytes) * 100).toFixed(1) ;
                  options.downPercentage = percentage;
              }
              //计算文件大小
              options.on.progress(options.receivedBytes, options.totalBytes, options.downPercentage, options.downSpeed);
          });

          //监听文件结束
          req.on('end', () => {
            console.log('-----------------', '下载结束');
              inputFiles.push(inputFile);
              if (inputFiles.length == options.files.length) {
                if (options.receivedBytes >= options.totalBytes) {
                    clearTimeout(options.onlineInteval);
                    clearTimeout(options.interval);
                    options.on.end(inputFiles);
                } else {
                  this.down(this.optionsA);
                }
                config.requestEnd = true;
              }
          });


          //监听下载错误
          req.on('error', (error) => {
              logger.error("下载文件异常, +:", inputFile, error);
              /*options.on.error(error);*/
          });

      });

      process.on('uncaughtException', function (err) {
           //打印出错误的调用栈方便调试
           logger.error('进程运行出现异常：', err.stack);
      });

      //监听promise没有处理的异常
      process.on('unhandledRejection',function(err,promise){
          logger.error('执行promise出现异常', err.stack);
      });      
  }
}


export default StreamDownload