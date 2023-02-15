export function toString(any: unknown): string {
  return typeof any === 'string' ? any : ''
}

export function toBoolean(any: unknown): boolean | undefined {
  return typeof any === 'boolean' ? any : undefined
}

export function toNumber(any: unknown): number {
  const number = Number(any)
  return isNaN(number) ? 0 : number
}
