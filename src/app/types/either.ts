export type Either<A, B> = Left<A> | Right<B>

export interface Left<A> {
  readonly tag: 'left'
  readonly value: A
}

export interface Right<B> {
  readonly tag: 'right'
  readonly value: B
}

export const right = <B>(value: B): Right<B> => ({tag: 'right', value: value})

export const left = <A>(value: A): Left<A> => ({tag: 'left', value: value})

export const fold = <A, B, C>(e: Either<A, B>, right: (b: B) => C, left: (a: A) => C): C => {
  switch (e.tag) {
    case 'left':
      return left(e.value)
    case 'right':
      return right(e.value)
  }
}

export const either = <A, B>(test: boolean, right: () => B, left: () => A,): Either<A, B> =>
  test ? {tag: 'right', value: right()} : {tag: 'left', value: left()}

export const rightValue = <A, B>(e: Either<A, B>): B =>
  fold(e, b => b, () => {
    throw new Error(`no right value found for ${e}`)
  })
