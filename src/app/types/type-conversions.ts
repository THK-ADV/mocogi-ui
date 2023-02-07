export function toString(any: unknown): string {
  return typeof any === 'string' ? any : ''
}

export function toNumber(any: unknown): number {
  const number = Number(any)
  return isNaN(number) ? 0 : number
}
