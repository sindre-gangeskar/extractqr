import { useCallback, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import fallbackImage from '@renderer/public/no_preview.jpg'
import { IPCResponse } from 'src/types/definitions'
export default function Home() {
  const [data, setData] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(fallbackImage)
  const [status, setStatus] = useState<IPCResponse['status']>(undefined)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false)
  const [clipboardState, toggleClipboardState] = useState<boolean | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const extractQRBtnText = 'Extract QR data from image'

  const handlePreview = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setSubmitEnabled(true)
    setResponseMessage(extractQRBtnText)
    setData(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem('qr') as HTMLInputElement | null
    const file = input?.files?.[0]
    if (!file) return
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const context = canvas.getContext('2d')
      context?.drawImage(img, 0, 0)

      if (!context) return
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const { data, width, height } = imageData

      const response = (await window.electron.ipcRenderer.invoke('scan', {
        data,
        width,
        height
      })) as IPCResponse
      setStatus(response.status)
      setSubmitEnabled(false)
      response.data ? setData(response.data) : setData(null)
      if (response.message) setResponseMessage(response.message)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data ?? '')
    toggleClipboardState((prev) => !prev)
  }

  useGSAP(() => {
    if (!preview) return
    gsap.set('#preview-img', { opacity: 0 })
    gsap.to('#preview-img', { opacity: 1, duration: 0.8, ease: 'power4.out' })
  }, [preview])

  useGSAP(() => {
    if (clipboardState === null || !data) return
    tlRef.current?.kill()
    const tl = gsap.timeline()
    tlRef.current = tl
    tl.set('#clipboard-message', { y: 0, opacity: 0, zIndex: -1 })
    tl.to('#clipboard-message', { y: 50, duration: 0.6, ease: 'power3.out', opacity: 1 })
    tl.to('#clipboard-message', { duration: 0.6, ease: 'power3.out', opacity: 0, delay: 3 })
  }, [clipboardState])
  return (
    <div className="flex flex-col gap-12">
      {preview && (
        <img
          src={preview}
          onError={() => {
            setPreview(fallbackImage)
          }}
          id="preview-img"
          className="w-100 max-h-62.5 h-full p-2 self-center opacity-0 object-contain"
        ></img>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          id="image"
          name="qr"
          accept=".png, .jpg, .jpeg, .webp"
          placeholder="Select Image"
          hidden
          onChange={handlePreview}
        />
        <label htmlFor="image" className="btn">
          Select Image
        </label>
        <button className={`btn ${submitEnabled === true ? 'primary' : 'disabled'}`} type="submit">
          {responseMessage ? responseMessage : 'Extract QR data from image'}
        </button>
      </form>
      <div className="data-container w-100 self-center min-h-max flex">
        <p
          className={`max-h-52 h-max p-3 w-100 whitespace-normal wrap-anywhere text-ellipsis overflow-hidden ${data && status === 'success' ? '' : 'text-center'} ${status === 'success' ? 'text-neutral-100' : 'text-red-300'}`}
        >
          {data ? data : null}
        </p>
      </div>
      {data && status === 'success' && (
        <div className="clipboard-wrapper flex flex-col gap-2 justify-center items-center">
          <button className={`btn primary mx-auto`} onClick={copyToClipboard}>
            Copy To Clipboard
          </button>
          <p
            id="clipboard-message"
            className=" text-green-200 p-3 rounded-full text-[12px] absolute opacity-0 pointer-events-none"
          >
            Copied to clipboard
          </p>
        </div>
      )}
    </div>
  )
}
