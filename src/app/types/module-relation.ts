export interface Parent {
  kind: 'parent'
  children: string[]
}

export interface Child {
  kind: 'child'
  parent: string
}

export type ModuleRelation = Parent | Child
