import { BsGithub } from 'react-icons/bs'
import Tooltip from './Tooltip'
export default function GitHub() {
  return (
    <a
      href="https://github.com/sindre-gangeskar/extractqr"
      target="_blank"
      rel="noreferrer"
      className="relative end-0 z-20 p-2 self-center hover:cursor-pointer hover:bg-neutral-700 transition-colors duration-200 group"
    >
      <i>
        <BsGithub size={20} />
      </i>
      <Tooltip text="Visit GitHub page" />
    </a>
  )
}
