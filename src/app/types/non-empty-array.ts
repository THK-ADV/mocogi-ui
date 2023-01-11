// https://gcanti.github.io/fp-ts/modules/NonEmptyArray.ts.html
export type NonEmptyArray<A> = Array<A> & { 0: A }
