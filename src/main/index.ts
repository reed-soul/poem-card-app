import { app, BrowserWindow, ipcMain, safeStorage } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null

// API Key 安全存储路径
const getApiKeyPath = () => path.join(app.getPath('userData'), '.api_key')

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 360,
    minHeight: 500,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#00000000',
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers - 窗口控制
ipcMain.handle('window:close', () => {
  app.quit()
})

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

// IPC handlers - API Key 安全存储
ipcMain.handle('apiKey:save', (_event, key: string) => {
  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(key)
      fs.writeFileSync(getApiKeyPath(), encrypted)
    } else {
      // 降级：如果加密不可用，仍写入文件（但不是明文 localStorage）
      fs.writeFileSync(getApiKeyPath(), Buffer.from(key, 'utf-8'))
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
})

ipcMain.handle('apiKey:load', () => {
  try {
    const keyPath = getApiKeyPath()
    if (!fs.existsSync(keyPath)) return ''
    const data = fs.readFileSync(keyPath)
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.decryptString(data)
    }
    return data.toString('utf-8')
  } catch {
    return ''
  }
})

ipcMain.handle('apiKey:clear', () => {
  try {
    const keyPath = getApiKeyPath()
    if (fs.existsSync(keyPath)) {
      fs.unlinkSync(keyPath)
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
})
