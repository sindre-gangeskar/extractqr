import { BiDownload } from 'react-icons/bi'
import Tooltip from './Tooltip'
import { AutoUpdaterProps } from 'src/types/definitions'
import { downloadUpdate } from '../lib/utils'
export default function DownloadUpdateButton({
  updaterData,
  className
}: {
  updaterData: AutoUpdaterProps
  className?: string
}) {
  return (
    <Tooltip text={updaterData.message}>
      <button
        className={`relative p-2 m-0 inline-flex justify-center items-center ${className} hover:cursor-pointer group`}
        onClick={downloadUpdate}
      >
        <BiDownload size={15} className="group-hover:text-green-300 text-white self-center" />
      </button>
    </Tooltip>
  )
}
