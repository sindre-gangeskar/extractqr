import * as dotenv from 'dotenv'
dotenv.config()
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import jsQR from 'jsqr'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { AutoUpdaterProps, IPCResponse } from '../types/definitions'
function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 600,
    minHeight: 900,
    minWidth: 600,
    titleBarStyle: process.platform == 'darwin' ? 'hiddenInset' : 'hidden',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}

app.whenReady().then(() => {
  const win = createWindow()
  electronApp.setAppUserModelId('com.electron')
  const updaterData: AutoUpdaterProps = {
    updateAvailable: false,
    message: ''
  }
  autoUpdater.disableWebInstaller = true
  if (is.dev) {
    autoUpdater.forceDevUpdateConfig = true
    autoUpdater.updateConfigPath = join(__dirname, '..', '..', 'dev-app-update.yml')
    autoUpdater.disableDifferentialDownload = true
  }

  autoUpdater.on('update-available', () => {
    updaterData.message = 'Update available'
    updaterData.updateAvailable = true
  })

  autoUpdater.on('checking-for-update', () => {
    updaterData.message = 'Checking for updates'
    updaterData.updateAvailable = false
  })

  autoUpdater.on('update-not-available', () => {
    updaterData.message = 'Up to date'
    updaterData.updateAvailable = false
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('download-progress', progress.percent)
  })

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('download-finished', true)
  })

  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdates()

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('check-updates', updaterData)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('toggle-devtools', () => {
    if (!is.dev) return
    win.webContents.toggleDevTools()
    win.focus()
  })
  ipcMain.handle(
    'scan',
    async (_event, imageData: { data: Uint8ClampedArray; width: number; height: number }) => {
      try {
        const extractedData = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        })
        return {
          data: extractedData?.data ?? '',
          status: extractedData?.data ? 'success' : 'fail',
          message: extractedData?.data
            ? 'Successfully extracted QR data'
            : 'No QR code found in image'
        } as IPCResponse
      } catch (error) {
        console.error(error)
        const response: IPCResponse = { data: 'Failed to extract data', status: 'error' }
        return response
      }
    }
  )
  ipcMain.handle('toggle-fullscreen', () => {
    if (!win.maximizable) return
    win.isMaximized() ? win.restore() : win.maximize()
  })
  ipcMain.handle('minimize', () => {
    if (!win.minimizable) return
    win.minimize()
  })
  ipcMain.handle('close', () => {
    app.emit('window-all-closed')
  })
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })
  ipcMain.handle('download-update', async () => {
    await autoUpdater.downloadUpdate()
  })
  ipcMain.handle('install-update', () => {
    if (!updaterData.updateAvailable) return
    autoUpdater.quitAndInstall()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
