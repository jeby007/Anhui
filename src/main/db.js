import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import config from './config'
import { remote, app } from 'electron'
import log4js from './lib/log-config'
const logger = log4js.getLogger();

//const APP = process.type === 'renderer' ? remote.app : app
//const STORE_PATH = APP.getPath('userData')
//const STORE_PATH =  process.cwd()
//const STORE_PATH = __dirname

/*if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}*/
/*const execPath = process.execPath;*/
/*const STORE_PATH = execPath.substring(0, execPath.lastIndexOf('\\'));*/

let APP = process.type === 'renderer' ? remote.app : app
let STORE_PATH = APP.getPath('userData')
if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}
logger.info('------------------STORE_PATH:', STORE_PATH);
const adapter = new FileSync(path.join(STORE_PATH, '/data.json'));
let db;
try {
	//初始化DBJson，如果出现异常，清空Json内容
	db = Datastore(adapter)
} catch(err) {
	logger.error('初始化lowdb，json信息异常，error：', err);
	//清空dataJson文件
    fs.unlinkSync(path.join(STORE_PATH, '/data.json'));
    db = Datastore(adapter);
}
const db1 = db;
export default db1