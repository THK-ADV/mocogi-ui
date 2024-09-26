export interface AssessmentMethodEntry {
  method: string
  percentage?: number
  precondition: string[]
}

export interface AssessmentMethods {
  mandatory: AssessmentMethodEntry[]
  optional: AssessmentMethodEntry[]
}
