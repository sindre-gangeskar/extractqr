import { useState } from 'react'
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal } from '@floating-ui/react'
export default function Tooltip({
  text,
  placement = 'top',
  children
}: {
  text: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState<boolean>(false)
  const { refs: floatingRefs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: placement
  })

  return (
    <>
      <span
        className="self-center items-center leading-none p-0"
        ref={floatingRefs.setReference}
        onMouseEnter={() => {
          setOpen(true)
        }}
        onMouseLeave={() => {
          setOpen(false)
        }}
      >
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={floatingRefs.setFloating}
            style={floatingStyles}
            className="rounded-2xl text-sm text-nowrap pointer-events-none m-0 p-0"
          >
            {text}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
