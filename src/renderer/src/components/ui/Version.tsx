import { useCallback, useEffect, useState } from 'react'

export default function Version() {
  const [version, setVersion] = useState<string>('')
  const getVersion = useCallback(async () => {
    const version = await window.electron.ipcRenderer.invoke('get-app-version')
    setVersion(version)
  }, [])

  useEffect(() => {
    const handleVersionCheck = async () => {
      await getVersion()
    }

    handleVersionCheck()
  }, [getVersion])

  return (
    <p id="version-tag" className=" text-sm self-center">
      v{version}
    </p>
  )
}
