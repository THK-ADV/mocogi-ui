import { toNumber, toString } from './type-conversions'

describe('type conversions', () => {
  it('should convert any to string', () => {
    expect(toString(undefined)).toEqual('')
    expect(toString(null)).toEqual('')
    expect(toString('' as unknown)).toEqual('')
    expect(toString(123)).toEqual('123')
    expect(toString('Hello')).toEqual('Hello')
    expect(toString('Hello' as unknown)).toEqual('Hello')
  })

  it('should convert any to number', () => {
    expect(toNumber(undefined)).toEqual(0)
    expect(toNumber(null)).toEqual(0)
    expect(toNumber('' as unknown)).toEqual(0)
    expect(toNumber(123)).toEqual(123)
    expect(toNumber('hello')).toEqual(0)
  })
})
