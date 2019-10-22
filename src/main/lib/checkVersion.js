import db from '../db'
import config from '../config'
import StreamDownload from '../util/StreamDownload'
const { net } = require('electron')
const path = require('path');
import fs from 'fs-extra'
var http = require('http');
var https = require("https");
var unzipper = require("unzipper");
import log4js from './log-config'


const logger = log4js.getLogger();

const checkVersion = {

	/**
	 * 检测版本更新
	 * 首先，从vue页面获取显示的车型
	 * 		从本地数据库里获取当前的版本 
	 * 				如果没有全量更新，
	 * 				如果有 比较版本号，并且校验目录里的版本与数据库是否一致。少一个版本 更新 增量包， 少多个版本，或者不一致 大更新
	 * @param {*} mainWindow 
	 * @param {*} versions vue需要的车型
	 */
	valid(mainWindow, versions) {
		//遍历所有车，查看是否已经下载到本地，并获取下载后的版本号
		for(var i in versions) {

			//遍历当前车的属性
			versions[i].forEach(element => {
				//线判断文件是否存在
				this.checkExist(element).then(json => {
					if (json) {
						element.empty = false;
						//element.unzip = true;
						element.version = json.version;
					}
					//远程获取版本号
					if (typeof(element.versionurl) != 'undefined') {
						this.getVersion(element).then(element => {
							//通知更新
							mainWindow.webContents.send('version:app:update', element);
						}).catch(ele => {
							//获取版本好出错
							mainWindow.webContents.send('version:app:check:error', element);
						}) ;
					} else {
						mainWindow.webContents.send('version:app:update', element);
					}
				});
			});
		} 
	},

	//判断本地是否已下载文件
	checkExist: function(element) {
		return new Promise((resolve) => {
           fs.readJson(path.join(config.app_root, '/resources/' + config.app_root_name + '/' + element.code+ '/package.json')).then((json) => {
				resolve(json);
		   }).catch(e => { 
				//目录为空 empty
				resolve();
				//console.log('本地没有下载文件')
		   });
      });
	} ,

	/**	
		远程获取版本号
	*/
	getVersion: function(element) {
		//远程获取当前车最新的版本号，对比看当前已下载版本是否需要更新
		return new Promise((resolve, reject) => {
			//获取版本号URL
			let verionUrl = config.versionDomain + element.versionurl;
			https.get(verionUrl, (response) => {
				if (response.statusCode == 200) {
					response.on("data", (rs) => {
						var data = JSON.parse(rs);
						let newVersion = data.version;
						//比较新旧版本，如果相差一个版本更新updater、如果查两个版本更新两个包
						element.newVersion = newVersion;	
						//判断是否检测到了新版本
						if (typeof(newVersion) != 'undefined') {
							//获取下载更新url
							element.baseurl = data.versionList[newVersion]['big'].base;
							element.otherurl = data.versionList[newVersion]['big'].other;
							element.updateurl = data.versionList[newVersion]['big'].update;
							//判断新旧版本
							if (element.version != '') {
								//比较新旧版本, 如果检测到新版本、将更新标识置为true
								if (newVersion > element.version) {
									element.update = true;
								}
							}
							//返回结果
							resolve(element);
						} 
					});
				} else {
					resolve(element);
					logger.error('下载' + element.code + '，获取远程版本信息出错, statusCode', response.statusCode );
				}
			}).on('error', err => {
				logger.error('请求获取版本号出错', element, err)
				reject(element);
			});	
		});
	},

	/*
		解压文件
	*/
	unzip: function(mainWindow, files, car) {
		 let _self = this;
		 if (files.length > 0) {
		 	let file = files.pop();
		 	let rs = fs.createReadStream(file);
		 	let extract  = unzipper.Extract({path: path.join(config.app_root, '/resources/' + config.app_root_name + '/' + car.code )});
			rs.pipe(extract);
			//监听解压结束, 递归解压
			rs.on('close', function () {
				console.log('', files.length);
				if (files.length == 0) {
					mainWindow.webContents.send('version:app:unzip', car);
				} else {
					_self.unzip(mainWindow, files, car);
				}
				_self.deleteZip(file);
			});
			//解压过程出错
			extract.on('error', function (err) {
			    console.log(err);
			});	 
		 }	
	},

	/*
		删除压缩包
	*/
	deleteZip: function(file) {
		//删除zip包
		fs.unlink(file, (error) => {
			if (error) {
				logger.error('删除zip包失败，error = ', error);
			} else {
				logger.info('文件' + file + '删除成功！');
			}
		})
	},

	/**
	 * 下载资源
	 * @param {*} mainWindow 
	 * @param {*} car 
	 */
	downLoad (mainWindow, car) {
		let _self = this;
		let baseDir = config.app_root  + '/' + car.code + '/';
		if (!fs.pathExistsSync(baseDir)) {
		    fs.mkdirpSync(baseDir)
		}
		StreamDownload.down({
			baseUrl: car.baseurl,		//base包路径
			otherUrl: car.otherurl,		//other包路径
			updateUrl: car.updateurl,	//小版本更新url
			oldVersion: car.version,	//旧版本
			newVersion: car.newVersion, //新版本
			baseDir: baseDir,
			success: (files) => {
				//通知当前状态 完成
				mainWindow.webContents.send('version:app:success', car);
				//解压文件
				this.unzip(mainWindow, files, car)
			},
			//下载进度
			showProgress: ({receivedBytes,totalBytes, downPercentage, downSpeed}) =>{
				//console.info("receivedBytes", receivedBytes,totalBytes, downPercentage);
				//显示进度条
				mainWindow.webContents.send('version:app:showProgress', {car,receivedBytes,totalBytes, downPercentage, downSpeed})
			},
			error: (err) =>{
				console.log('网络下载异常', err);
				//通知前台网络异常
				mainWindow.webContents.send('version:app:network:error', car)
			},
		})
		
	},

	/**	
		删除下载文件
	*/
	delete(mainWindow, car) {
		let filePath = path.join(config.app_root, '/resources/' + config.app_root_name + '/' + car.code);
		try {
			del(filePath).then(() => {
				//通知前台删除结果
				mainWindow.webContents.send('version:app:delete:result', car);
			}) ;	
		} catch(err) {
			logger.error('删除' + filePath + '失败！', err);
			mainWindow.webContents.send('version:app:error', '删除文件失败！');
		}
	}
}

/**
	递归删除目录
*/
var del = function(filePath) {
	return new Promise((resolve) => {
		if( fs.existsSync(filePath) ) {
	        fs.readdirSync(filePath).forEach(function(file) {
	            var curPath = filePath + "/" + file;
	            //如果是文件夹、递归
	            if(fs.statSync(curPath).isDirectory()) { // recurse
	                del(curPath);
	            } else { 
	            	//如果是文件，直接删除
	                fs.unlinkSync(curPath);
	            }
	        });
	        //清除文件夹
	        fs.rmdirSync(filePath);
	        resolve();
	    }
	});

	
}

export default checkVersion