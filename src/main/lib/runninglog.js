/*
		与大通用户运行日志接口
*/
import config from '../config'
import serverApi from './serverApi'
import login from './login'
import log4js from './log-config'
const app = require('electron').app;
const schedule = require("node-schedule");

const logger = log4js.getLogger();

const runningLog = {
	
	job: {},

	/*
		打开App启动日志
	*/
	openApp: function(comment) {
		if (!comment) {
			comment = '打开应用';
		}
		this.saveDealerLoginLog(1, comment);
		if (JSON.stringify(this.job) == "{}") {
			this.startHeartbeat();
		}
	},

	/*
		退出应用		
	*/
	closeApp: function(callback) {
		this.cancelHeartbeat();
		this.saveDealerLoginLog(2, '退出应用', resp => {
			callback(resp);
		}, err => {
			callback(resp);
		});
	},

	/*
		开始发送心跳
	*/
	startHeartbeat: function() {
		let _self = this;
		let rule = new schedule.RecurrenceRule();
		rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
		_self.job = schedule.scheduleJob(rule, function(){
			_self.saveDealerLoginLog(3, '心跳');
		});
	},

	/*
		取消心跳
	*/
	cancelHeartbeat: function() {
		if (JSON.stringify(this.job) != "{}") {
			this.job.cancel();
		}
	},

	/*
		检测是否需要更新
	*/
	checkUpdate: function(success) {
		this.saveDealerLoginLog(4, '检测版本号', resp => {
			if (resp && resp.status == true && resp.data.needUpdate == true) {
				let appVersionExpected = resp.data.appVersionExpected;
				let appCurrentVersion = app.getVersion();
				if (appVersionExpected > appCurrentVersion) {
					success(appVersionExpected);
				}
			}
		});
	},

	/*
		调用大通接口
			type 登录类型 1:登录 2:登出 3:心跳 4:其他 
			comment 备注
	*/
	saveDealerLoginLog: function(type, comment, success, error) {
		let dealer = login.findDealer();
		if (typeof(dealer) != undefined && dealer != undefined) {
			let params = {
					dmsCode: dealer.dmsCode,
					dmsName: dealer.dealerName,
					type: type,
					appVersion: app.getVersion(),
					comment: comment
			}
			logger.info('请求保存经销商运行日志, request：', params);
			serverApi.post(config.maxusDomain + '/dealer/dealer/saveDealerLoginLog', params, resp => {
				logger.info('保存经销商运行日志响应信息，response：', resp);
				if (success) {
					success(resp);
				}
			}, err => {
				logger.error('保存经销商运行日志报错，error：', err);
				if (error) {
					error(err);
				}
			});
		}
	}
}
export default runningLog	
