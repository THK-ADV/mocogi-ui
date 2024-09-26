import { Ordering } from './ordering'
import { Identity } from '../types/core/person'

export const numberOrd: Ordering<number> = (lhs, rhs) => {
  if (lhs < rhs) {
    return -1
  }
  return lhs > rhs ? 1 : 0
}

export const stringOrd: Ordering<string> = (lhs, rhs) => {
  const res = lhs.localeCompare(rhs)
  if (res === 0) {
    return 0
  }
  return res > 0 ? 1 : -1
}

export const peopleOrd = Ordering.many<Identity>([
  Ordering.contraMap(numberOrd, ({ kind }) => {
    switch (kind) {
      case 'person':
        return 0
      case 'group':
        return 1
      case 'unknown':
        return 2
    }
  }),
  Ordering.contraMap(stringOrd, (p) => {
    switch (p.kind) {
      case 'person':
        return p.lastname
      case 'group':
        return p.label
      case 'unknown':
        return p.label
    }
  }),
])
