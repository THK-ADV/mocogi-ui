import { Ordering } from './ordering'
import { Person } from '../types/core/person'

export const numberOrd: Ordering<number> = (lhs, rhs) =>
  lhs < rhs ? -1 : (lhs > rhs ? 1 : 0)

export const stringOrd: Ordering<string> = (lhs, rhs) => {
  const res = lhs.localeCompare(rhs)
  return res === 0 ? 0 : (res > 0 ? 1 : -1)
}

export const peopleOrd = Ordering.many<Person>([
  Ordering.contraMap(numberOrd, ({kind}) => {
    switch (kind) {
      case 'default':
        return 0
      case 'group':
        return 1
      case 'unknown':
        return 2
    }
  }),
  Ordering.contraMap(stringOrd, (p) => {
    switch (p.kind) {
      case 'default':
        return p.lastname
      case 'unknown':
        return p.label
      case 'group':
        return p.label
    }
  }),
])
