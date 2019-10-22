import db from '../db'
import config from '../config'
import menus from './menus'
import log4js from '../lib/log-config'
import serverApi from './serverApi'

const logger = log4js.getLogger();

const login = {

	/*
		调用接口获取经销商信息
	*/
	getDealer: function(pwd, success, error) {
		/*740938761*/
		let _self = this;
		let url = config.maxusDomain + '/dealer/dealer/getDealerInfoByPwd?pwd=' + pwd;
		serverApi.gets(url, resp => {
			if (resp && resp.status == true) {
				let _data = resp.data;
				success(_data);
			} else {
				error(resp);
			}
		}, err => {
			logger.error('登录获取经销商信息出错, errorcode:', err);
			error(err);
		});
	},

	/**
		检查当前登录经销商是否需要更新客户端
	*/
	checkDealer: function() {
		let _self = this;
		return new Promise((resolve) => {

			let dealer = this.findDealer();
			//如果当前未登录，自动更新客户端
			if (typeof(dealer) == undefined || dealer == undefined) {
				resolve();
			} 
			serverApi.get(config.update_url + 'dealers.json', resp => {
				if (resp.allupdate) {
					resolve();
				} else if (resp.dealers) {
					for (let i in resp.dealers) {
						if (resp.dealers[i] == dealer.ipadPwd) {
							resolve();
							break;
						}
					}
				}
			});
		});
	},


	/*
		保存经销商信息至lowDB
	*/
	saveDealer: function(data) {
		/*let dealer  = {};
		dealer[pwd] = data;*/
		db.set('dealer', data).write();
	},

	/*
		删除数据
	*/
	deleteDealer: function() {
		db.remove('dealer').write();
	},

	/*
		从lowDB中查找经销商信息
	*/
	findDealer: function() {
		return db.get('dealer').write();
	}, 

	/*
		隐藏登录按钮
	*/
	hideLoginBth: function() {
		menus.getMenuItem('loginBtn').visible = false;
		/*menus.getMenuItem('hasLoginBtn').visible = true;*/
	}
}

export default login
