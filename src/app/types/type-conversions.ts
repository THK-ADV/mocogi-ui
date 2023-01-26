export function toString(any: any): string {
  return any === undefined || any === null ? '' : String(any)
}

export function toNumber(any: any): number {
  const number = Number(any)
  return isNaN(number) ? 0 : number
}
