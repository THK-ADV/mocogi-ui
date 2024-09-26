export interface PrerequisiteEntry {
  text: string
  modules: string[]
  pos: string[]
}

export interface PrerequisitesOutput {
  recommended?: PrerequisiteEntry
  required?: PrerequisiteEntry
}
