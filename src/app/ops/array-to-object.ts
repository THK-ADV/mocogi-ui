export const arrayToObject = <A>(as: readonly A[], id: (a: A) => string): { [id: string]: A } => {
  const obj: { [id: string]: A } = {}
  as.forEach(a => obj[id(a)] = a)
  return obj
}

