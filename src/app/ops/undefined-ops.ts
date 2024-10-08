export function mapOpt<A, B>(a: A | undefined, f: (_: A) => B): B | undefined {
  if (!a) {
    return undefined
  }
  return f(a)
}

export function foldOpt<A, B>(
  a: A | undefined,
  f: (_: A) => B,
  fallback: () => B,
): B {
  return mapOpt(a, f) ?? fallback()
}
