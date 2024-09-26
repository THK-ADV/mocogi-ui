export const arrayToObject = <A>(
  as: readonly A[],
  id: (_: A) => string,
): { [id: string]: A } => {
  const obj: { [id: string]: A } = {}
  as.forEach((a) => {
    obj[id(a)] = a
  })
  return obj
}
