import { BsGithub } from 'react-icons/bs'
export default function GitHub() {
  return (
    <a
      href="https://github.com/sindre-gangeskar/extractqr"
      target="_blank"
      rel="noreferrer"
      className="btn hover:cursor-pointer hover:bg-neutral-700 transition-colors duration-200 p-3 aspect-square"
    >
      <BsGithub scale={2} size={12} />
    </a>
  )
}
