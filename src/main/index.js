import { app, Menu, BrowserWindow,ipcMain } from 'electron'
import listening from './lib/listening'
import config from './config'
import AutoUpdateApp from './util/AutoUpdateApp'
import menus from './lib/menus'
import runningLog from './lib/runningLog'

const dialog = require('electron').dialog;



/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    /*height: 563,*/
    /*height: 450,
    width: 680,*/
    fullscreen: true,//
    useContentSize: true
    
  });


  //加载主页面
  mainWindow.loadURL(menus.winURL);
  //关闭调试模式
  mainWindow.webContents.closeDevTools();
  //mainWindow.webContents.openDevTools()
  Menu.setApplicationMenu(menus.customMenus());
  //隐藏按钮
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
      mainWindow = null
  });


  mainWindow.onbeforeunload = (e) => {
    console.log('I do not want to be closed')
    e.returnValue = false 
  }

 //开始监听脚本
 listening.start(mainWindow);

 
 
 console.log(app.getVersion());
 
}

/*
    限制只能启动一个应用程序
*/
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
          mainWindow.restore()
      }
      mainWindow.focus()
      mainWindow.show()
    }
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    runningLog.closeApp(resp => {
        app.quit();
    });
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


