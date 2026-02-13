import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  close: () => ipcRenderer.invoke('window:close'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  // 设置面板窗口控制
  enterSettings: () => ipcRenderer.invoke('window:enterSettings'),
  leaveSettings: () => ipcRenderer.invoke('window:leaveSettings'),
  // API Key 安全存储
  saveApiKey: (key: string) => ipcRenderer.invoke('apiKey:save', key),
  loadApiKey: () => ipcRenderer.invoke('apiKey:load'),
  clearApiKey: () => ipcRenderer.invoke('apiKey:clear'),
})
