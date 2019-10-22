const Menu = require('electron').Menu;
import config from '../config'
//import transformPdf from './transformPdf'

const menus = {

	winURL : process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`,
	menu: {},
	customMenus() {
		var _self = this;


		_self.menu =  Menu.buildFromTemplate([
		      {
		        label: '窗口',
		        submenu: [
		          {
		            label: '全屏',
		            accelerator: (function () {
		                if (process.platform === 'darwin') {
		                  return 'Ctrl+Command+F'
		                } else {
		                  return 'F11'
		                }
		              })(),
		            click: function (item, focusedWindow) {
		                if (focusedWindow) {
		                  focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
		                  focusedWindow.setMenuBarVisibility(!focusedWindow.isFullScreen());
		                }
		              }
		          },
		          {
		            label: '关闭',
		            accelerator: 'CmdOrCtrl+W',
		            role: 'close'
		          }
		        ]
		      },
		      {
		        label: '查看',
		        submenu: [
			        {
			          label: '主页面',
			          //accelerator: 'CmdOrCtrl+R',
			          click: function (item, focusedWindow) {
			            if (focusedWindow) {
			            	config.closeWind = false;
			              focusedWindow.loadURL(_self.winURL);
			            }
								}
			        },
			        {
			          label: '管理员主页面',
			          //accelerator: 'CmdOrCtrl+R',
			          click: function (item, focusedWindow) {
			          	let loadUrl = _self.winURL + '?isadmin=true';
			            if (focusedWindow) {
			            	config.closeWind = false;
			              focusedWindow.loadURL(loadUrl);
			            }
			          }
			        },{
								label:'reload',
								accelerator:'CmdOrCtrl+Shift+R',
								click(item,focusedWindow){
									console.log(focusedWindow);
									focusedWindow.webContents.send('app:refresh');
								}
							}

			        //,
			         /*{
					    label: '是否显示价格',
					    submenu: [
					      {
					      	label: '显示',
					      	type: 'radio',
					      	checked: config.isShowPrice,
					      	click: function(item, focusedWindow) {
					      		config.isShowPrice = true;
					      		if (focusedWindow) {
					      			focusedWindow.loadURL(_self.winURL);
					      		}
					      	}
					      },
					      {
					      	label: '不显示',
					      	type: 'radio',
					      	checked: !config.isShowPrice,
					      	click: function(item, focusedWindow) {
					      		config.isShowPrice = false;
					      		if (focusedWindow) {
					      			focusedWindow.loadURL(_self.winURL);
					      		}
					      	}
					      }
					    ]
					  }*/
			        //,
			       /* {
			        	id:'loginBtn',
			        	label: '登录',
			        	click: function(item, focusedWindow) {
			        		if (focusedWindow) {
			        			focusedWindow.webContents.send('app:login:showBox');
			        		}
			        	},
			        	visible: true
			        }*/
		        ]
		      },
		      {
		        label: '帮助',
		        submenu: [{
		          label: '开发者工具',
		          accelerator: (function () {
		                if (process.platform === 'darwin') {
		                  return 'Alt+Command+I'
		                } else {
		                  return 'Ctrl+Shift+I'
		                }
		              })(),
		              click: function (item, focusedWindow) {
		                if (focusedWindow) {
		                  focusedWindow.toggleDevTools()
		                }
		              }
		        }]
		      }
		  ]);
		return _self.menu;
	},
	/*
		获取
	*/
	getMenuItem: function(id) {
		let _self = this;
		return _self.menu.getMenuItemById(id);
	}

}
export default menus
