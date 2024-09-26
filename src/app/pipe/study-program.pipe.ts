import { Pipe, PipeTransform } from '@angular/core'
import { StudyProgram } from '../types/module-compendium'
import { showStudyProgram } from '../ops/show.instances'

@Pipe({
  name: 'studyProgram',
})
export class StudyProgramPipe implements PipeTransform {
  transform(studyProgram: StudyProgram, mode: string): unknown {
    if (mode === 'withoutPO') {
      if (studyProgram.specialization) {
        return `${studyProgram.deLabel} ${studyProgram.specialization.deLabel} (${studyProgram.degree.deLabel})`
      }
      return `${studyProgram.deLabel} (${studyProgram.degree.deLabel})`
    }
    return showStudyProgram(studyProgram)
  }
}
