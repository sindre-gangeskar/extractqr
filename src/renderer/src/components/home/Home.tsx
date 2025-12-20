import { useCallback, useState } from 'react'
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
  const [clipboardCopied, setClipboardCopied] = useState<boolean>(false)
  const extractQRBtnText = 'Extract QR code from image'
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
    if (!img) return
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
      setClipboardCopied(false)
      response.data ? setData(response.data) : setData(null)
      if (response.message) setResponseMessage(response.message)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data ?? '')
    setClipboardCopied((prev) => !prev)
  }

  useGSAP(() => {
    if (!preview) return
    gsap.set('#preview-img', { opacity: 0 })
    gsap.to('#preview-img', { opacity: 1, duration: 0.8, ease: 'power4.out' })
  }, [preview])
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
          accept=".png, .jpg"
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
          className={`max-h-52 h-max p-3 w-100 whitespace-normal wrap-anywhere text-ellipsis overflow-hidden ${data && status === 'success' ? '' : 'text-center'} ${status === 'success' ? 'text-sky-300' : 'text-red-300'}`}
        >
          {data ? data : null}
        </p>
      </div>
      {status === 'success' && (
        <button
          className={`btn ${clipboardCopied ? 'success' : 'primary'} mx-auto`}
          onClick={copyToClipboard}
        >
          {clipboardCopied ? 'Copied to clipboard' : 'Copy To Clipboard'}
        </button>
      )}
    </div>
  )
}
