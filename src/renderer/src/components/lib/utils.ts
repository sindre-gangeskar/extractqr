export const toggleFullscreen = async () => {
  await window.electron.ipcRenderer.invoke('toggle-fullscreen')
}
export const minimize = async () => {
  await window.electron.ipcRenderer.invoke('minimize')
}
export const close = async () => {
  await window.electron.ipcRenderer.invoke('close')
}
export const installUpdate = async () => {
  await window.electron.ipcRenderer.invoke('install-update')
}
export const downloadUpdate = async () => {
  await window.electron.ipcRenderer.invoke('download-update')
}
