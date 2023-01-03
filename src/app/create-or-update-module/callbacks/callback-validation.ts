// Mandatory

export function validMandatoryObject(value: any): boolean {
  return value !== undefined &&
    value !== '' &&
    value !== null
}

export function validMandatoryBoolean(value: any): boolean {
  return value !== undefined &&
    value !== '' &&
    value !== null &&
    typeof value == 'boolean'
}

export function validMandatoryCommaSeparatedNumber(value: any): boolean {
  function go(value: string): boolean {
    const res = value.match('^[1-8](,[1-8])*$')
    return res !== null && Array.isArray(res)
  }

  return value !== undefined &&
    value !== '' &&
    value !== null &&
    go(value)
}

// Optional

export function validOptionalObject(value: any): boolean {
  return value === undefined ||
    typeof value === 'object' ||
    value === ''
}

export function validOptionalNumber(value: any): boolean {
  return value === undefined ||
    (typeof value === 'string' && !isNaN(Number(value)))
}

export function validOptionalCommaSeparatedNumber(value: any): boolean {
  return value === undefined ||
    value === '' ||
    (typeof value === 'string' && validMandatoryCommaSeparatedNumber(value))
}
