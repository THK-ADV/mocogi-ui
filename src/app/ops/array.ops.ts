export function mapFilterUndefined<A, B>(
  as: ReadonlyArray<A>,
  f: (a: A) => B | undefined,
): B[] {
  const bs: B[] = []
  for (const a of as) {
    const b = f(a)
    b && bs.push(b)
  }
  return bs
}
