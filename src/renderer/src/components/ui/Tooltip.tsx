export default function Tooltip({ text }: { text: string }) {
  return (
    <p
      id="tooltip"
      className="absolute top-8 left-[50%] -translate-x-[50%] rounded-2xl p-2 opacity-0 group-hover:opacity-100 group-hover:top-14 text-sm w-fit text-nowrap bg-neutral-700 pointer-events-none transition-all duration-200"
    >
      {text}
    </p>
  )
}
