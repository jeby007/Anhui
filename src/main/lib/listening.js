const ipcMain = require('electron').ipcMain;
const app = require('electron').app;
const dialog = require('electron').dialog;
import config from '../config'
const url = require('url');
const path = require('path');
import menus from './menus'
import checkVersion from './checkVersion'
import AutoUpdateApp from '../util/AutoUpdateApp'
import cmdExec from './cmdExec'
import commons from './commons'
import log4js from './log-config'
import login from './login'


//运行日志
import runningLog from './runningLog'


const logger = log4js.getLogger();

const listening = {

	start(mainWindow) {
		config.getDataPath();

		this.updateApp(mainWindow);
		
		this.checkVueAppVersion(mainWindow);
		this.openMaxus(mainWindow);
		this.closeWindow(mainWindow);
		//记录安装后启动exe文件路径
		commons.recordPath();

		this.login(mainWindow);

		//发送给大通打开应用日志
		runningLog.openApp();
	},
	/**
	* vue页面APP版本更新
	*/
	checkVueAppVersion (mainWindow) {
		/**
		 * 检测版本
		 */
		 ipcMain.on("version:app:checkVersion",(event, versions)=>{
			checkVersion.valid(mainWindow, versions)
		 });
		 /**
		  * 下载
		  */
		 ipcMain.on("version:app:downCar",(event,arg)=>{
			checkVersion.downLoad(mainWindow, arg)
		 });

		 /**
		  * 加载本地路径资源
		  * arg 文件名称 如 d90/index.html
		  */
		ipcMain.on("load:url:localhost",(event, arg)=>{
			let filePath = path.join(config.app_root, '/resources/' + config.app_root_name + '/' + arg.loadUrl);
			
			config.closeWind = true;
			let loadUrl = 'file://'+filePath + "#home?_mode_drive_=os";
			if (arg && arg.isLogin) {
				loadUrl += '&_dmsCode_=' +  arg.dmsCode;
			}
			loadUrl += '&isShowPrice=' +  config.isShowPrice;
			logger.info('加载本地文件', loadUrl);
			mainWindow.loadURL(loadUrl)
		});

		//删除指定资源
		ipcMain.on("version:app.delete", (event, arg) => {
			checkVersion.delete(mainWindow, arg);
		});	

		//监听提示信息，提醒
		ipcMain.on('dialog:message', (event, title, message) => {
		    const options = {
		        type: 'info',
		        title: title,
		        message: message,
		    }
		    dialog.showMessageBox(options)
		});

		//监听错误信息，弹出dialog提醒
		ipcMain.on('dialog:error:message', (event, message) => { 
			logger.error('----------------', message);
		    //dialog.showErrorBox('错误', message)
		});
	},

	/**
	* APP 更新
			1、获取当前登录用户信息
			2、如果用户未登录，自动更新
			3、如果用户已登录在配置经销商中，自动更新
	*/
	updateApp (mainWindow) {
		ipcMain.on('autoupdate:app:check', (e, arg) => {
			//调用大通接口，查看当前经销商是否需要升级外壳
			runningLog.checkUpdate(version => {
				let feedUrl = config.maxusDomain + '/h5/dealersq/Download/' + version
				logger.error('检测更新外壳, feedUrl = ', feedUrl);
				AutoUpdateApp.checkForUpdates(mainWindow, feedUrl);
			});
		});
	},

	//监听打开应用，执行cmd命令
	openMaxus(mainWindow) {
		//打开G50
		ipcMain.on('version:app:openG50', (e, arg) => {
		  logger.info('打开应用G50');	
		  cmdExec.openG50(() => {
		  		/*app.exit();*/
		  });

		});	
		//打开D90
		ipcMain.on('version:app:openD90', (e, arg) => {
		  logger.info('打开应用D90');	
		  cmdExec.openD90(() => {
		  		/*mainWindow.close();*/
		  });
		});	

		//打开D20
		ipcMain.on('version:app:openG20', (e, arg) => {
		  logger.info('打开应用G20');	
		  cmdExec.openG20(() => {
		  		/*mainWindow.close();*/
		  });
		});	
	},

	//关闭窗口
	closeWindow(mainWindow) {

		//监听关闭行为
		mainWindow.on('close', (event) => {
			if (config.closeWind) {
				mainWindow.webContents.send('window:close');
				//阻塞当前关闭行为
				event.preventDefault();
			}
		});

		//监听关闭结果
		//监听是否关闭浏览器
		ipcMain.on('window:close:result', (e, data) => {
			if (data == 1) {
				mainWindow = null;
      			app.exit();
			}
		});
	},

	login(mainWindow) {

		/*
			查询lowdb看是否存有经销商信息
			如果有经销商信息表示已登录
		*/
		ipcMain.on('app:login:check', (e) => {
			let dealer = login.findDealer();
			if (typeof(dealer) != undefined && dealer != undefined) {
				//通知前台已登录
				mainWindow.webContents.send('app:login:success', dealer);
			} else {
				//未登录通知显示登陆框
				mainWindow.webContents.send('app:login:showBox');
			}
		});

		ipcMain.on('app:login:getdealer', (e, pwd) => {
			login.getDealer(pwd, data => {
				mainWindow.webContents.send('app:login:getdealer:success', data);
				//login.hideLoginBth();//隐藏登录按钮
			}, err => {
				logger.info("获取经销商信息失败", err);
				mainWindow.webContents.send('app:login:getdealer:fail', err);
			});
		});

		/*
			确认登录记录经销商信息
		*/
		ipcMain.on('app:login:confirm', (e, data) => {
			login.saveDealer(data);
			mainWindow.webContents.send('app:login:success', data);
			runningLog.openApp('登录应用');
		});

		/*
			跳转主页面
		*/
		ipcMain.on('app:load.main.page', (e) => {
		 	mainWindow.loadURL(menus.winURL);
		});

		/*
			获取应用版本号
		*/
		ipcMain.on('window:app:getversion', (e) => {
			mainWindow.webContents.send('window:app:version', app.getVersion());
		});
	}

}

export default listening