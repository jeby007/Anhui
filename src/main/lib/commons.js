const path = require('path');
import fs from 'fs-extra'
import config from '../config'
import log4js from './log-config'

const logger = log4js.getLogger();

const commons = {
	//记录路径
	recordPath: function() {
		let filePath = process.execPath;
		//判断exe是否存在
		if (fs.existsSync(filePath)) {
			//递归创建目录
			this.mkdir(config.screenPath);
			//记录大屏exe访问路径
			this.write(config.screenPath, filePath);
		} else {
			logger.info('未找到启动exe文件', filePath);
		}
	},
	//写文件
	write :function(screenPath, data) {
		fs.writeFile(screenPath, data, { 'flag': 'w' } , err => {
			if (err) {
				logger.error('记录启动exe路径写入失败', data, err);
			} else {
				logger.info('记录启动exe路径写入成功', data);
			}
		});
	},
	//递归创建目录
	mkdir: function(filepath) {
		const dirCache = {};
		const dirArr = filepath.split('/');
	    let dir = dirArr[0];
	    for (let i = 1; i < dirArr.length; i++) {
	        if(!dirCache[dir] && !fs.existsSync(dir)){
	            dirCache[dir]=true;
	            fs.mkdirSync(dir);
	        }
	        dir = dir + '/'+ dirArr[i];
	    }
	}
}
export default commons
