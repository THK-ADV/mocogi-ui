import { SingleEntryCallback } from './single-entry-callback'
import { StudyProgram } from '../../types/module-compendium'

export class PrerequisitesStudyProgramCallback extends SingleEntryCallback<StudyProgram> {
  constructor(
    all: Readonly<StudyProgram[]>,
    selected: Readonly<StudyProgram[]>,
    attr: string,
    show: (p: StudyProgram) => string,
  ) {
    super(all, selected, attr, (p) => p.po.id, show)
  }
}
