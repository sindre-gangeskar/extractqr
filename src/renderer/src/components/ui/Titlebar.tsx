import { VscChromeMaximize, VscChromeMinimize, VscChromeClose } from 'react-icons/vsc'
import GitHub from './GitHub'
import { toggleFullscreen, minimize, close } from '../lib/utils'
import Tooltip from './Tooltip'
import Logo from '@renderer/public/icon.png'
export default function Titlebar() {
  const titlebarBtnClasses = 'relative btn'

  return (
    <nav className="fixed top-0 right-0 m-0 bg-neutral-900 w-screen draggable flex justify-between max-h-9 h-full">
      <div className="navbar titlebar w-100 flex-1 p-0 flex align-center content-center ps-3">
        <div id="app-name" className="flex items-center">
          <img src={Logo} width={25} height={25} alt="logo" />
          <p className="px-3 self-center">ExtractQR</p>
        </div>
      </div>
      <div className="titlebar-container flex row">
        <Tooltip text="Visit Github Repo" placement="bottom">
          <GitHub />
        </Tooltip>
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
