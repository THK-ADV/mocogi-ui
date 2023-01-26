/*
  implicit val errWrites: Writes[PipelineError] =
    Writes.apply {
      case PipelineError.Parser(value) =>
        Json.obj(
          "kind" -> "parsing-error",
          "error" -> Json.obj(
            "found" -> value.found,
            "expected" -> value.expected
          )
        )
      case PipelineError.Printer(value) =>
        Json.obj(
          "kind" -> "printing-error",
          "error" -> Json.obj(
            "found" -> value.found,
            "expected" -> value.expected
          )
        )
      case PipelineError.Validator(value) =>
        Json.obj(
          "kind" -> "validation-error",
          "error" -> Json.obj(
            "id" -> value.id,
            "title" -> value.title,
            "errors" -> Json.toJson(value.errs)
          )
        )
    }
 */

export interface ParsingError {
  kind: 'parsing-error'
  error: {
    found: string
    expected: string
  }
}

export interface PrintingError {
  kind: 'printing-error'
  error: {
    found: string
    expected: string
  }
}

export interface ValidationError {
  kind: 'validation-error'
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
