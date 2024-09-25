import { throwError as throwError_ } from '../types/error'
import { toBoolean, toNumber, toString } from './type-conversions'

function throwError(key: string, record: Record<string, unknown>): never {
  throwError_(`expected key '${key}', but found ${JSON.stringify(record)}`)
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && value !== undefined) {
    return value as Record<string, unknown>
  } else {
    throwError_(`expected value ${value} to be convertable to a record`)
  }
}

export function parse<A>(
  key: string,
  record: Record<string, unknown>,
  f: (u: unknown) => A,
): A {
  return key in record ? f(record[key]) : throwError(key, record)
}

export function parseString(
  key: string,
  record: Record<string, unknown>,
): string {
  return parse(key, record, (u) => toString(u))
}

export function parseNumber(
  key: string,
  record: Record<string, unknown>,
): number {
  return parse(key, record, (u) => toNumber(u))
}

export function parseBoolean(
  key: string,
  record: Record<string, unknown>,
): boolean {
  return parse(
    key,
    record,
    (u) => toBoolean(u) ?? throwError_(`expected boolean, but was ${u}`),
  )
}

export function parsePeekString(
  keys: ReadonlyArray<string>,
  record: Record<string, unknown>,
): string {
  const key = keys[0]
  return keys.length === 1
    ? parseString(key, record)
    : parse(key, record, (v) => parsePeekString(keys.slice(1), asRecord(v)))
}

export function parseOptional<A>(
  key: string,
  record: Record<string, unknown>,
  f: (v: unknown) => A,
): A | undefined {
  if (!(key in record)) {
    return undefined
  }
  const value = record[key]
  return value === null || value === undefined ? undefined : f(value)
}

export function parseArray<A>(
  key: string,
  record: Record<string, unknown>,
  f: (v: unknown) => A,
): A[] {
  return parse(key, record, (p) => (Array.isArray(p) ? p.map((v) => f(v)) : []))
}

export function parsePeekArray(
  keys: ReadonlyArray<string>,
  record: Record<string, unknown>,
): string[] {
  if (keys.length === 0) {
    return []
  }
  const key = keys[0]
  return parse(key, record, (values) => {
    if (Array.isArray(values)) {
      return values.map((value) =>
        parsePeekString(keys.slice(1), asRecord(value)),
      )
    }
    return []
  })
}
