import { AutoUpdaterProps } from 'src/types/definitions'
import { useEffect, useState } from 'react'
import DownloadUpdateButton from './DownloadUpdateButton'
import InstallUpdateButton from './InstallUpdateButton'
import Version from './Version'
import { BiDownload } from 'react-icons/bi'
export default function Toolbar() {
  const [updaterData, setUpdaterData] = useState<AutoUpdaterProps>({
    message: '',
    updateAvailable: false
  })

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [downloadFinished, setDownloadFinished] = useState<boolean>(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('check-updates', (_, data) => {
      if (data) setUpdaterData(data)
      console.log(data)
    })

    window.electron.ipcRenderer.on('download-progress', (_, progress) => {
      setDownloadProgress(progress)
    })

    window.electron.ipcRenderer.on('download-finished', (_, isFinished: boolean) => {
      if (isFinished) setDownloadFinished(isFinished)
    })
  }, [])
  return (
    <div
      id="toolbar-wrapper"
      className="left-0 absolute bottom-0 w-screen h-4 flex gap-3 justify-between p-5"
    >
      <Version />
      {updaterData.updateAvailable && !downloadFinished && !downloadProgress && (
        <DownloadUpdateButton updaterData={updaterData} />
      )}
      {updaterData.updateAvailable && !downloadFinished && downloadProgress && (
        <div
          id="download-progress-bar-parent"
          className={`self-center h-2 w-full max-w-24 inline-flex items-center gap-3 `}
        >
          <BiDownload className="grow-0 shrink-0" size={20} />
          <div
            id="download-progress-bar"
            className={` h-full bg-amber-300`}
            style={{ width: `${downloadProgress ?? 0}%` }}
          ></div>
        </div>
      )}
      {downloadFinished && <InstallUpdateButton />}
    </div>
  )
}
