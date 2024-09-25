export interface POs {
  mandatory: POMandatory[]
  optional: POOptional[]
}

export interface POMandatory {
  po: string
  specialization?: string
  recommendedSemester: number[]
}

export interface POOptional {
  po: string
  specialization?: string
  instanceOf: string
  partOfCatalog: boolean
  recommendedSemester: number[]
}
