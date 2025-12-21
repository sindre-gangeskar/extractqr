import { VscChromeMaximize, VscChromeMinimize, VscChromeClose } from 'react-icons/vsc'
import { BsQrCode } from 'react-icons/bs'
import GitHub from './GitHub'
import Version from './Version'

export default function Titlebar() {
  const toggleFullscreen = async () => {
    await window.electron.ipcRenderer.invoke('toggle-fullscreen')
  }
  const minimize = async () => {
    await window.electron.ipcRenderer.invoke('minimize')
  }
  const close = async () => {
    await window.electron.ipcRenderer.invoke('close')
  }

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
      <div className="titlebar-container flex row flex-0 gap-3">
        <GitHub />
        <div className="button-grp flex row">
          <button className="btn" onClick={minimize}>
            <VscChromeMinimize size={12} />
          </button>
          <button className="btn" onClick={toggleFullscreen}>
            <VscChromeMaximize size={12} />
          </button>
          <button className="btn close" onClick={close}>
            <VscChromeClose size={12} />
          </button>
        </div>
      </div>
    </nav>
  )
}
