import {
  AssessmentMethod,
  Language,
  Location,
  Metadata,
  Module,
  ModuleType,
  Person,
  POPreview,
  Season,
  Status
} from '../../http/http.service'
import { simpleInput } from './simple-inputs'
import { responsibilityInput } from './responsibility-input'
import { assessmentMethodInput, AssessmentMethodKind } from './assessment-method-input'
import { workloadInput } from './workload-input'
import { MatDialog } from '@angular/material/dialog'
import { prerequisitesInputs, PrerequisitesKind } from './prerequisites-input'

export const requiredLabel = (label: string): string =>
  label + ' *'

export const optionalLabel = (label: string): string =>
  label + ' (Optional)'

export function inputs(
  modules: Module[],
  moduleTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  persons: Person[],
  assessmentMethods: AssessmentMethod[],
  pos: POPreview[],
  dialog: MatDialog,
  fromControlValueForAttr: (attr: string) => any,
  metadata?: Metadata
) {
  function generalInformationSection() {
    return {
      header: 'Allgemeine Informationen',
      value: simpleInput(moduleTypes, languages, seasons, locations, status, metadata)
    }
  }

  function responsibilitySection() {
    return {
      header: 'Verantwortliche',
      value: responsibilityInput(dialog, persons, currentLecturerSelection, metadata)
    }
  }

  function assessmentMethodsSection() {
    return {
      header: 'Prüfungsformen',
      value: assessmentMethodInput(dialog, assessmentMethods, currentAssessmentMethodEntrySelection)
    }
  }

  function workloadSection() {
    return {
      header: 'Workload',
      value: workloadInput(metadata)
    }
  }

  function prerequisitesSection() {
    return {
      header: 'Voraussetzungen',
      value: prerequisitesInputs(
        dialog,
        modules,
        currentPrerequisitesModulesSelection,
        pos,
        currentPrerequisitesPOsSelection,
        metadata
      )
    }
  }

  function currentMultipleSelectionValue<A>(
    attr: string,
    fallback: (metadata: Metadata) => A[]
  ): A[] {
    const entries = fromControlValueForAttr(attr)
    return Array.isArray(entries) ? entries.map(e => e.value) : (metadata ? fallback(metadata) : [])
  }

  function currentAssessmentMethodEntrySelection(attr: string, kind: AssessmentMethodKind) {
    return currentMultipleSelectionValue(attr, m => kind === 'mandatory' ? m.assessmentMethods.mandatory : m.assessmentMethods.optional)
  }

  function currentLecturerSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => persons.filter(p => m.lecturers.some(l => l === p.id))
    )
  }

  function currentPrerequisitesModulesSelection(attr: string, kind: PrerequisitesKind) {
    return currentMultipleSelectionValue(
      attr,
      m => modules.filter(x => {
        const modules = kind === 'required' ? m.prerequisites.required?.modules : m.prerequisites.recommended?.modules
        return modules?.some(y => y === x.abbrev)
      })
    )
  }

  function currentPrerequisitesPOsSelection(attr: string, kind: PrerequisitesKind) {
    return currentMultipleSelectionValue(
      attr,
      m => pos.filter(x => {
        const pos = kind === 'required' ? m.prerequisites.required?.pos : m.prerequisites.recommended?.pos
        pos?.some(y => y === x.id)
      })
    )
  }

  return [
    generalInformationSection(),
    responsibilitySection(),
    assessmentMethodsSection(),
    workloadSection(),
    prerequisitesSection()
  ]
}
