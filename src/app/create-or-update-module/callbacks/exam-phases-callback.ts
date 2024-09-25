import { SingleEntryCallback } from './single-entry-callback'
import { ExamPhase } from '../../types/core/exam-phase'

export class ExamPhasesCallback extends SingleEntryCallback<ExamPhase> {
  constructor(
    all: Readonly<ExamPhase[]>,
    selected: Readonly<ExamPhase[]>,
    attr: string,
    show: (p: ExamPhase) => string,
  ) {
    super(all, selected, attr, (p) => p.id, show)
  }
}
