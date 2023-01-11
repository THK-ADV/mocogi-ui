export interface PrerequisitesOutput {
  recommended?: PrerequisiteEntry,
  required?: PrerequisiteEntry
}

export interface PrerequisiteEntry {
  text: string,
  modules: string[],
  pos: string[]
}
