import { AssessmentMethod, Language, Location, Metadata, ModuleType, Person, Season, Status } from '../../http/http.service'
import {
  abbreviationInput,
  creditsInput,
  durationInput,
  frequencyInput,
  languagesInput,
  locationsInput,
  moduleTypesInput,
  statusInput,
  titleInput
} from './simple-inputs'
import { lecturerInput, moduleCoordinatorInput } from './responsibility-input'
import { assessmentMethodsMandatoryInput, assessmentMethodsOptionalInput } from './assessment-method-input'
import { exerciseInput, lectureInput, practicalInput, projectSupervisionInput, projectWorkInput, seminarInput } from './workload-input'
import { MatDialog } from '@angular/material/dialog'

export function inputs(
  moduleTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  persons: Person[],
  assessmentMethods: AssessmentMethod[],
  dialog: MatDialog,
  fromControlValueForAttr: (attr: string) => any,
  metadata?: Metadata
) {
  function generalInformationSection() {
    return {
      header: 'Allgemeine Informationen',
      value: [
        titleInput(metadata),
        abbreviationInput(metadata),
        moduleTypesInput(moduleTypes, metadata),
        creditsInput(metadata),
        languagesInput(languages, metadata),
        durationInput(metadata),
        frequencyInput(seasons, metadata),
        locationsInput(locations, metadata),
        statusInput(status, metadata)
      ]
    }
  }

  function responsibilitySection() {
    return {
      header: 'Verantwortliche',
      value: [
        moduleCoordinatorInput(persons, metadata),
        lecturerInput(
          dialog,
          persons,
          attr => currentLecturerSelection(attr)
        ),
      ]
    }
  }

  function assessmentMethodsSection() {
    return {
      header: 'Prüfungsformen',
      value: [
        assessmentMethodsMandatoryInput(
          dialog,
          assessmentMethods,
          attr => currentMultipleSelectionValue(attr, m => m.assessmentMethods.mandatory)
        ),
        assessmentMethodsOptionalInput(
          dialog,
          assessmentMethods,
          attr => currentMultipleSelectionValue(attr, m => m.assessmentMethods.optional)
        )
      ]
    }
  }

  function workloadSection() {
    return {
      header: 'Workload',
      value: [
        lectureInput(metadata),
        seminarInput(metadata),
        practicalInput(metadata),
        exerciseInput(metadata),
        projectWorkInput(metadata),
        projectSupervisionInput(metadata),
      ]
    }
  }

  function currentMultipleSelectionValue<A>(
    attr: string,
    fallback: (metadata: Metadata) => A[]
  ): A[] {
    const entries = fromControlValueForAttr(attr)
    return Array.isArray(entries) ? entries.map(e => e.value) : (metadata ? fallback(metadata) : [])
  }

  function currentLecturerSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => persons.filter(p => m.lecturers.some(l => l === p.id))
    )
  }

  return [
    generalInformationSection(),
    responsibilitySection(),
    assessmentMethodsSection(),
    workloadSection()
  ]
}
