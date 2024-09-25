export type Ordering<A> = (lhs: A, rhs: A) => OrderingResult

export type OrderingResult = -1 | 0 | 1

export namespace Ordering {
  const empty =
    <A>(): Ordering<A> =>
    () =>
      0

  export const contraMap =
    <A, B>(ord: Ordering<A>, f: (b: B) => A): Ordering<B> =>
    (b0, b1) =>
      ord(f(b0), f(b1))

  export const combine =
    <A>(ord1: Ordering<A>, ord2: Ordering<A>): Ordering<A> =>
    (lhs, rhs) => {
      const res1 = ord1(lhs, rhs)
      return res1 === 0 ? ord2(lhs, rhs) : res1
    }

  export const many = <A>(ords: ReadonlyArray<Ordering<A>>): Ordering<A> => {
    switch (ords.length) {
      case 0:
        return empty()
      case 1:
        return ords[0]
      default:
        return ords.reduce(combine)
    }
  }
}
