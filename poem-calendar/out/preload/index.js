"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  close: () => electron.ipcRenderer.invoke("window:close"),
  minimize: () => electron.ipcRenderer.invoke("window:minimize"),
  maximize: () => electron.ipcRenderer.invoke("window:maximize"),
  // API Key 安全存储
  saveApiKey: (key) => electron.ipcRenderer.invoke("apiKey:save", key),
  loadApiKey: () => electron.ipcRenderer.invoke("apiKey:load"),
  clearApiKey: () => electron.ipcRenderer.invoke("apiKey:clear")
});
