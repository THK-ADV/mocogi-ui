export interface POs {
  mandatory: POMandatory[],
  optional: POOptional[]
}

export interface POMandatory {
  po: string,
  recommendedSemester: number[],
  recommendedSemesterPartTime: number[]
}

export interface POOptional {
  po: string,
  instanceOf: string,
  partOfCatalog: boolean,
  recommendedSemester: number[]
}

export interface POPreview {
  id: string
  label: string
  abbrev: string
}
