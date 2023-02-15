// defined in NgbAlert

export type AlertType =
  'success' |
  'info' |
  'warning' |
  'danger'

export interface Message {
  kind: 'message'
  value: string
}

export interface Html {
  kind: 'html'
  value: string
}

type AlertBody = Message | Html

export interface Alert {
  type: AlertType
  body: AlertBody
  autoDismiss: boolean
}
