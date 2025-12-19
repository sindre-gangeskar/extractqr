type StatusType = 'success' | 'fail' | 'error'

export interface IPCResponse {
  data?: string
  status: StatusType | undefined
}
