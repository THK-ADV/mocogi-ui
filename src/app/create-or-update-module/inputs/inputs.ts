import {
  AssessmentMethod,
  Competence,
  GlobalCriteria,
  Language,
  Location,
  Metadata,
  Module,
  ModuleType,
  Participants,
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
import { poInput } from './po-input'
import { miscellaneousInput } from './miscellaneous-input'
import { mapOpt } from '../../ops/undefined-ops'

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
  competences: Competence[],
  globalCriteria: GlobalCriteria[],
  dialog: MatDialog,
  fromControlValueForAttr: (attr: string) => any,
  metadata?: Metadata
) {
  function generalInformationSection() {
    return {
      header: 'Allgemeine Informationen',
      value: simpleInput(
        dialog,
        moduleTypes,
        languages,
        seasons,
        locations,
        status,
        currentParticipants,
        metadata
      )
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

  function poSection() {
    return {
      header: 'Verwendung des Moduls in weiteren Studiengängen',
      value: poInput(
        dialog,
        pos,
        modules, // TODO generic modules only
        attr => currentMultipleSelectionValue(attr, m => m.po.mandatory),
        attr => currentMultipleSelectionValue(attr, m => m.po.optional),
      )
    }
  }

  function miscellaneousSection() {
    return {
      header: 'Sonstige Informationen',
      value: miscellaneousInput(
        dialog,
        competences,
        modules,
        globalCriteria,
        currentCompetencesSelection,
        currentGlobalCriteriaSelection,
        currentTaughtWithSelection
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

  function currentCompetencesSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => competences.filter(c => m.competences.some(x => x === c.abbrev))
    )
  }

  function currentGlobalCriteriaSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => globalCriteria.filter(g => m.globalCriteria.some(x => x === g.abbrev))
    )
  }

  function currentTaughtWithSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => modules.filter(mod => m.taughtWith.some(x => x === mod.id))
    )
  }

  function currentParticipants(attr: string): Participants | undefined {
    const res = currentMultipleSelectionValue(attr, m => mapOpt(m.participants, a => [a]) ?? [])
    return res.length === 0 ? undefined : res[0]
  }

  return [
    generalInformationSection(),
    responsibilitySection(),
    assessmentMethodsSection(),
    workloadSection(),
    prerequisitesSection(),
    poSection(),
    miscellaneousSection()
  ]
}
