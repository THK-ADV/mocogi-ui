// Mandatory

export function validMandatoryObject(value: unknown): boolean {
  return value !== undefined && value !== '' && value !== null
}

export function validMandatoryBoolean(value: unknown): boolean {
  return (
    value !== undefined &&
    value !== '' &&
    value !== null &&
    typeof value === 'boolean'
  )
}

export function validMandatoryCommaSeparatedNumber(value: unknown): boolean {
  function go(str: string): boolean {
    const res = str.match('^[1-8](,[1-8])*$')
    return res !== null && Array.isArray(res)
  }

  return (
    value !== undefined &&
    value !== '' &&
    value !== null &&
    typeof value === 'string' &&
    go(value)
  )
}

export function validMandatoryNumber(value: unknown): boolean {
  return (
    value !== undefined &&
    value !== '' &&
    value !== null &&
    !Number.isNaN(Number(value))
  )
}

// Optional

export function validOptionalObject(value: unknown): boolean {
  return value === undefined || typeof value === 'object' || value === ''
}

export function validOptionalNumber(value: unknown): boolean {
  return (
    value === undefined ||
    (typeof value === 'string' && !Number.isNaN(Number(value)))
  )
}

export function validOptionalCommaSeparatedNumber(value: unknown): boolean {
  return (
    value === undefined ||
    value === '' ||
    (typeof value === 'string' && validMandatoryCommaSeparatedNumber(value))
  )
}
