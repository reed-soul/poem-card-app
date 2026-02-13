"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
let mainWindow = null;
const getApiKeyPath = () => path__namespace.join(electron.app.getPath("userData"), ".api_key");
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 360,
    minHeight: 500,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: "#00000000"
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path__namespace.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.handle("window:close", () => {
  electron.app.quit();
});
electron.ipcMain.handle("window:minimize", () => {
  mainWindow?.minimize();
});
electron.ipcMain.handle("window:maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
electron.ipcMain.handle("apiKey:save", (_event, key) => {
  try {
    if (electron.safeStorage.isEncryptionAvailable()) {
      const encrypted = electron.safeStorage.encryptString(key);
      fs__namespace.writeFileSync(getApiKeyPath(), encrypted);
    } else {
      fs__namespace.writeFileSync(getApiKeyPath(), Buffer.from(key, "utf-8"));
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
electron.ipcMain.handle("apiKey:load", () => {
  try {
    const keyPath = getApiKeyPath();
    if (!fs__namespace.existsSync(keyPath)) return "";
    const data = fs__namespace.readFileSync(keyPath);
    if (electron.safeStorage.isEncryptionAvailable()) {
      return electron.safeStorage.decryptString(data);
    }
    return data.toString("utf-8");
  } catch {
    return "";
  }
});
electron.ipcMain.handle("apiKey:clear", () => {
  try {
    const keyPath = getApiKeyPath();
    if (fs__namespace.existsSync(keyPath)) {
      fs__namespace.unlinkSync(keyPath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
