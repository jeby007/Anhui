import fs from 'fs-extra'
import { remote, app } from 'electron'



const config = {
	//下载下来的文件跟路径 存在 /resources 下
	app_root_name: 'app',
	app_root: '',
	app_data_path: '',
	
	//大通接口域名
	maxusDomain: 'https://c2b.saicmaxus.com',
	//maxusDomain: 'https://c2bt4.maxuscloud.com',
	//车型版本号，域名
	versionDomain: 'https://c2bapi.saicmaxus.com', //正式环境	
	/*versionDomain: 'https://c2bt4.maxuscloud.com',//测试环境*/
	//炫舞exe访问路径文件
	chooserPath: "C://maxus_c2b//MaxusScreen.Path",
	//记录大屏exe访问路径文件
	screenPath: "C://maxus_c2b//Maxus.Path",
	closeWind: false,
	//是否显示价格
	isShowPrice: true,
	//请求是否结束
	requestEnd: true, 

	//获取exe文件所在目录
	getRootPath: function() {
		let execPath = process.execPath;
		this.app_root = execPath.substring(0, execPath.lastIndexOf('\\'));
	},

	//获取用户机器AppData目录
	getDataPath: function() {
		let APP = process.type === 'renderer' ? remote.app : app
		let STORE_PATH = APP.getPath('userData')
		
		if (process.type !== 'renderer') {
		  if (!fs.pathExistsSync(STORE_PATH)) {
		    fs.mkdirpSync(STORE_PATH)
		  }
		}
		this.app_root = STORE_PATH;
	}
}

export default config