import { app,ipcMain,  BrowserWindow ,screen } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`



function createWindow () {
  let size = screen.getPrimaryDisplay().workAreaSize
  let screenwidth = parseInt(size.width)
  let screenheight = parseInt(size.height )


  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    x:screenwidth-240,
    y:screenheight-240,
    frame: false,
    width:240,
    height:240,
    transparent: true,
    webPreferences:{
      devTools:false
    },
    alwaysOnTop:true,
    skipTaskbar:true
  })
  mainWindow.loadURL(winURL)


  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 放大镜
let zoom;
ipcMain.on('zoom',()=>{
  zoom = new BrowserWindow({
    fullscreen:true,
    frame: false,
    transparent: true,
    webPreferences:{
      devTools:false
    }
  })

  zoom.loadURL(`file://${__static}/zoom.html`);
  zoom.on('closed',()=>{zoom = null})
})

ipcMain.on('zoomClose',()=> {
  zoom.close();
})

let moveInter;
ipcMain.on('moveWindow',()=> {
  var point = screen.getCursorScreenPoint();
  var mx = point.x;
  var my = point.y;

  moveInter = setInterval(function () {
    point = screen.getCursorScreenPoint();
    var movex = point.x - mx;
    var movey = point.y - my;
    mx = point.x;
    my = point.y;
    var position = mainWindow.getPosition();
    console.log(position[0] + movex)
    mainWindow.setPosition(position[0] + movex,position[1] + movey,true)
  },10)
})


ipcMain.on('stopWindow',()=> {
  clearInterval(moveInter);
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})




/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater'


/**
 * 自动更新
 */
function autoUpdate() {
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(obj) {
    mainWindow.webContents.send('updateMessage', obj)
  }

  // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新......',
    updateAva: '监测到新版本，正在下载......',
    updateNotAva: '现在使用的就是最新版本，不用下载'
  }

  // 当更新出现错误时触发
  autoUpdater.on('error', (err) => {
    // sendUpdateMessage('error')
    sendUpdateMessage({action: 'error', errorInfo: err})
  })

  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    // sendUpdateMessage('checking')
    console.log("111")
    sendUpdateMessage({action: 'checking'})
  })

  // 当发现一个可用更新的时候触发，更新下载包会自动开始
  autoUpdater.autoDownload = true
  autoUpdater.on('update-available', (info) => {
    // sendUpdateMessage('updateAva')
    console.log("111")
    sendUpdateMessage({action: 'updateAva', updateInfo: info})
  })

  // 当没有可用更新的时候触发
  autoUpdater.on('update-not-available', (info) => {
    // sendUpdateMessage('updateNotAva')
    console.log("111")
    sendUpdateMessage({action: 'updateNotAva', updateInfo: info})
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })

  /**
   * event Event
   * releaseNotes String - 新版本更新公告
   * releaseName String - 新的版本号
   * releaseDate Date - 新版本发布的日期
   * updateUrl String - 更新地址
   */
  autoUpdater.on('update-downloaded', (info) => {
    // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
    mainWindow.webContents.send('downloadProgress', {percent: 100})
    // 可以手动选择是否立即退出并更新
    ipcMain.on('isUpdateNow', (e, arg) => {
      // some code here to handle event

      autoUpdater.quitAndInstall()
    })
})

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    console.log("111")
    autoUpdater.checkForUpdatesAndNotify()
  })

  ipcMain.on('downloadUpdate', () => {
    // 下载
    autoUpdater.downloadUpdate()
  })
}



app.on('ready', () => {

  autoUpdate()
})

