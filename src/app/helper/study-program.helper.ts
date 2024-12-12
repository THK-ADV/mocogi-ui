import { StudyProgram } from '../types/module-compendium'

export function isStudyProgram(
  studyProgram: StudyProgram,
  selectedPoId: string,
  selectedSpecializationId: string | undefined,
): boolean {
  if (selectedSpecializationId && studyProgram.specialization) {
    return (
      studyProgram.po.id === selectedPoId &&
      selectedSpecializationId === studyProgram.specialization.id
    )
  }
  return studyProgram.po.id === selectedPoId && !studyProgram.specialization
}
