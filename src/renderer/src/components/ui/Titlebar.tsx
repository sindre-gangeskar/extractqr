import { VscChromeMaximize, VscChromeMinimize, VscChromeClose } from 'react-icons/vsc'
import { BsQrCode } from 'react-icons/bs'
import GitHub from './GitHub'
import Version from './Version'
import { useEffect } from 'react'
import { BiDownload } from 'react-icons/bi'
import { AutoUpdaterProps } from 'src/types/definitions'
import { useState } from 'react'
import Tooltip from './Tooltip'

export default function Titlebar() {
  const [updaterData, setUpdaterData] = useState<AutoUpdaterProps>({
    updateAvailable: false,
    message: ''
  })
  const [downloadFinished, setDownloadFinished] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const toggleFullscreen = async () => {
    await window.electron.ipcRenderer.invoke('toggle-fullscreen')
  }
  const minimize = async () => {
    await window.electron.ipcRenderer.invoke('minimize')
  }
  const close = async () => {
    await window.electron.ipcRenderer.invoke('close')
  }
  const installUpdate = async () => {
    await window.electron.ipcRenderer.invoke('install-update')
  }

  const downloadUpdate = async () => {
    await window.electron.ipcRenderer.invoke('download-update')
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('check-updates', (_, data) => {
      if (data) setUpdaterData(data)
    })

    window.electron.ipcRenderer.on('download-progress', (_, progress) => {
      setDownloadProgress(progress)
    })

    window.electron.ipcRenderer.on('download-finished', (_, isFinished: boolean) => {
      if (isFinished) setDownloadFinished(isFinished)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('check-updates')
      window.electron.ipcRenderer.removeAllListeners('download-finished')
      window.electron.ipcRenderer.removeAllListeners('download-progress')
    }
  }, [])

  const titlebarBtnClasses = 'relative btn'
  return (
    <nav className="fixed top-0 right-0 m-0 bg-neutral-900 w-screen draggable flex justify-between">
      <div className="navbar titlebar w-100 flex-1 p-0 flex align-center content-center ps-3">
        <div id="app-name" className="flex">
          <i className="self-center">
            <BsQrCode />
          </i>
          <p className="px-3 self-center">ExtractQR</p>
          <Version />
        </div>
      </div>
      <div className="titlebar-container flex row">
        {updaterData.updateAvailable && !downloadFinished && downloadProgress <= 100 && (
          <div id="download-progress-parent" className="place-self-center px-3 max-w-16 w-100">
            <div
              id="download-progress-bar"
              className={`place-self-center-safe bg-white h-100 max-h-1 max-w-16 relative`}
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}
        {downloadFinished && updaterData.updateAvailable && (
          <button onClick={installUpdate} className="btn text-xs text-amber-300">
            Click here to install update
          </button>
        )}
        {updaterData.updateAvailable && !downloadFinished && (
          <button className={`${titlebarBtnClasses} group`} onClick={downloadUpdate}>
            <BiDownload size={12} className="group-hover:text-green-300" />
            <Tooltip text={updaterData.message} />
          </button>
        )}
        <GitHub />
        <div className="button-grp flex row">
          <button className={titlebarBtnClasses} onClick={minimize}>
            <VscChromeMinimize size={12} />
          </button>
          <button className={titlebarBtnClasses} onClick={toggleFullscreen}>
            <VscChromeMaximize size={12} />
          </button>
          <button className={`${titlebarBtnClasses} close`} onClick={close}>
            <VscChromeClose size={12} />
          </button>
        </div>
      </div>
    </nav>
  )
}
