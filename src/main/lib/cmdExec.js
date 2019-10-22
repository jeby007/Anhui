const exec = require('child_process').exec;
import fs from 'fs-extra'
import config from '../config'
import log4js from './log-config'

const logger = log4js.getLogger();

const cmdExec = {

	/**
		打开桌面QQ
	*/
	execCmd: function(code, success) {	
		if (fs.existsSync(config.chooserPath)) { 
			fs.readJson(config.chooserPath).then(json => {
				
				if (json.MaxusChooserPath) {
					var cmd = "start " + json.MaxusChooserPath + " " + code;
					exec(cmd, function(error, stdout, stderr) {
						if (error) {
							logger.info('execCmd方法执行cmd命令出错', cmd);
						} else {
							success();
							logger.info('execCmd方法执行cmd命令成功', cmd);
						}
					});        
				}
			});	
		}
	},
	//打开G50
	openG50: function(success) {
		logger.info('执行openG50方法');
		this.execCmd('G50', () => {
			success();
		});
	},
	//打开D90
	openD90: function(success) {
		logger.info('执行openD90方法');
		this.execCmd('D90', () => {
			success();
		});
	},
	//打开D90
	openG20: function(success) {
		logger.info('执行openG20方法');
		this.execCmd('G20', () => {
			success();
		});
	}
}
export default cmdExec
