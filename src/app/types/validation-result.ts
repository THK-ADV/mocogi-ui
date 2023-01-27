import { NonEmptyArray } from './non-empty-array'

export interface ParsingError {
  tag: 'parsing-error'
  error: {
    found: string
    expected: string
  }
}

export interface PrintingError {
  tag: 'printing-error'
  error: {
    found: string
    expected: string
  }
}

export interface ValidationError {
  tag: 'validation-error'
  error: {
    id: string
    title: string
    errors: string[]
  }
}

export type PipelineError =
  ParsingError |
  PrintingError |
  ValidationError

export interface ValidationSuccess {
  tag: 'success'
  data: null
}

export interface ValidationFailure {
  tag: 'failure'
  data: NonEmptyArray<PipelineError>
}

export type ValidationResult =
  ValidationSuccess |
  ValidationFailure
