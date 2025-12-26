import { BsGithub } from 'react-icons/bs'
import Tooltip from './Tooltip'
export default function GitHub() {
  return (
    <a
      href="https://github.com/sindre-gangeskar/extractqr"
      target="_blank"
      rel="noreferrer"
      className="relative btn end-0 self-center hover:cursor-pointer hover:bg-neutral-700 transition-colors duration-200 group"
    >
      <BsGithub />
      <Tooltip text="Visit GitHub page" />
    </a>
  )
}
