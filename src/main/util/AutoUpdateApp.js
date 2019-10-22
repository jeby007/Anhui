import { app,ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import config from '../config'
const dialog = require('electron').dialog;
import log4js from '../lib/log-config';
const logger = log4js.getLogger();



//执行自动更新检查
const AutoUpdateApp={
  checkForUpdates(mainWindow, feedUrl) {
          
          // 配置安装包远端服务器
          autoUpdater.setFeedURL(feedUrl);

          // 当更新发生错误的时候触发。
          autoUpdater.on('error', (error) => {
             logger.error('---------------', error);
          });

          // 当开始检查更新的时候触发
          autoUpdater.on('checking-for-update', (message) => {
              mainWindow.webContents.send('autoupdate:app:checking-for-update', { message });
          });

          //有更新下载
          autoUpdater.on('update-available', (message) => {
              mainWindow.webContents.send('autoupdate:app:update-available', { message });
          });

          //无更新可下载
          autoUpdater.on('update-not-available', (message) => {
              mainWindow.webContents.send('autoupdate:app:update-not-available', { message });
          });

          // 更新下载进度事件
          autoUpdater.on('download-progress', (progressObj) => {
              mainWindow.webContents.send('autoupdate:app:download-progress', { progressObj});
          });

          // 更新下载完成事件
          autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
              /*mainWindow.webContents.send('autoupdate:app:isUpdateNow');
              ipcMain.on('updateNow', (e, arg) => {
                  autoUpdater.quitAndInstall();
              });*/
              logger.info('=======================安装更新');
              autoUpdater.quitAndInstall();
          });

          //当调用quitAndInstall()之后，会在所有窗口关闭前发出before-quit
          //此监听处理关闭窗口前的操作
          autoUpdater.on('before-quit-for-update', (progressObj) => {
              console.log('', progressObj)
          });

        //执行自动更新检查
        autoUpdater.checkForUpdates();
  }
}
export default AutoUpdateApp