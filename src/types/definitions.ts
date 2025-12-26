type StatusType = 'success' | 'fail' | 'error'

export interface IPCResponse {
  data?: string
  status: StatusType | undefined
  message?: string | null
}

export interface AutoUpdaterProps {
  updateAvailable: boolean
  message: string
}
