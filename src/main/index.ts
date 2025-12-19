import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import jsQR from 'jsqr'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { IPCResponse } from '../types/definitions'
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 600,
    minHeight: 900,
    minWidth: 600,
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
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.handle(
    'scan',
    async (_event, imageData: { data: Uint8ClampedArray; width: number; height: number }) => {
      try {
        const extractedData = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        })
        return {
          data: extractedData?.data ?? 'No QR code found in image',
          status: extractedData?.data ? 'success' : 'fail'
        } as IPCResponse
      } catch (error) {
        console.error(error)
        const response: IPCResponse = { data: 'Failed to extract data', status: 'error' }
        return response
      }
    }
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
