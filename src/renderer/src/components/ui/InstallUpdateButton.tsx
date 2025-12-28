import { installUpdate } from '../lib/utils'
export default function InstallUpdateButton() {
  return (
    <button onClick={installUpdate} className="btn text-xs text-amber-300 self-center">
      Click here to install update
    </button>
  )
}
