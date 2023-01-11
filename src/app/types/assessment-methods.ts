export interface AssessmentMethods {
  mandatory: AssessmentMethodEntry[],
  optional: AssessmentMethodEntry[]
}

export interface AssessmentMethodEntry {
  method: string,
  percentage?: number,
  precondition: string[]
}
