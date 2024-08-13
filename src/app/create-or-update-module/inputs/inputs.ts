import { simpleInput } from './simple-inputs'
import { responsibilityInput } from './responsibility-input'
import { assessmentMethodInput, AssessmentMethodKind } from './assessment-method-input'
import { workloadInput } from './workload-input'
import { MatDialog } from '@angular/material/dialog'
import { prerequisitesInputs, PrerequisitesKind } from './prerequisites-input'
import { studyProgramInput } from './study-program-input'
import { miscellaneousInput } from './miscellaneous-input'
import { mapOpt } from '../../ops/undefined-ops'
import { moduleContent } from './module-content-input'
import { learningMethodsContent } from './learning-methods-content-input'
import { literatureContent } from './literature-content-input'
import { particularitiesContent } from './particularities-content-input'
import { learningOutcomeContent } from './learning-outcome-content-input'
import { Participants } from '../../types/participants'
import { ModuleRelation } from '../../types/module-relation'
import { MetadataLike } from '../../types/metadata'
import { Location } from '../../types/core/location'
import { Language } from '../../types/core/language'
import { Status } from '../../types/core/status'
import { AssessmentMethod } from '../../types/core/assessment-method'
import { ModuleType } from '../../types/core/module-type'
import { Season } from '../../types/core/season'
import { Identity } from '../../types/core/person'
import { GlobalCriteria } from '../../types/core/global-criteria'
import { Competence } from '../../types/core/competence'
import { ModuleCore, ModuleLike } from '../../types/moduleCore'
import { Section } from 'src/app/form/module-form/module-form.component'
import { StudyProgram } from '../../types/module-compendium'
import { GenericModuleCore } from '../../types/genericModuleCore'

export const requiredLabel = (label: string): string =>
  label + ' *'

export const optionalLabel = (label: string): string =>
  label + ' (Optional)'

export type Lang = 'de' | 'en'

export function inputs(
  modules: ModuleCore[],
  genericModules: GenericModuleCore[],
  moduleTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  persons: Identity[],
  assessmentMethods: AssessmentMethod[],
  studyPrograms: StudyProgram[],
  competences: Competence[],
  globalCriteria: GlobalCriteria[],
  dialog: MatDialog,
  fromControlValueForAttr: (attr: string) => unknown,
  moduleCompendium?: ModuleLike,
  metadataId?: string,
): Section<unknown, unknown>[] {
  const metadata = moduleCompendium?.metadata
  const deContent = moduleCompendium?.deContent
  const enContent = moduleCompendium?.enContent

  function generalInformationSection(): Section<unknown, unknown> {
    return {
      header: 'Allgemeine Informationen',
      rows: simpleInput(
        dialog,
        moduleTypes,
        languages,
        seasons,
        locations,
        status,
        modules,
        currentParticipants,
        currentModuleRelation,
        metadata,
        metadataId,
      ),
    }
  }

  function responsibilitySection() {
    return {
      header: 'Verantwortliche',
      rows: responsibilityInput(dialog, persons, currentLecturerSelection, metadata?.moduleManagement),
    }
  }

  function assessmentMethodsSection(): Section<unknown, unknown> {
    return {
      header: 'Prüfungsformen',
      rows: assessmentMethodInput(dialog, assessmentMethods, currentAssessmentMethodEntrySelection),
    }
  }

  function workloadSection() {
    return {
      header: 'Workload',
      rows: workloadInput(metadata?.workload),
    }
  }

  function prerequisitesSection() {
    return {
      header: 'Voraussetzungen',
      rows: prerequisitesInputs(
        dialog,
        modules,
        currentPrerequisitesModulesSelection,
        studyPrograms,
        currentPrerequisitesStudyProgramSelection,
        metadata?.prerequisites,
      ),
    }
  }

  function studyProgramSelection() {
    return {
      header: 'Verwendung des Moduls in weiteren Studiengängen',
      rows: studyProgramInput(
        dialog,
        studyPrograms,
        genericModules,
        attr => currentMultipleSelectionValue(attr, m => m.po.mandatory),
        attr => currentMultipleSelectionValue(attr, m => m.po.optional),
      ),
    }
  }

  function miscellaneousSection() {
    return {
      header: 'Sonstige Informationen',
      rows: miscellaneousInput(
        dialog,
        competences,
        modules,
        globalCriteria,
        currentCompetencesSelection,
        currentGlobalCriteriaSelection,
        currentTaughtWithSelection,
      ),
    }
  }

  function learningOutcomeContentSection() {
    return {
      header: 'Angestrebte Lernergebnisse',
      rows: learningOutcomeContent(deContent, enContent),
    }
  }

  function moduleContentSection() {
    return {
      header: 'Modulinhalte',
      rows: moduleContent(deContent, enContent),
    }
  }

  function learningMethodsContentSection() {
    return {
      header: 'Lehr- und Lernmethoden',
      rows: learningMethodsContent(deContent, enContent),
    }
  }

  function literatureContentSection() {
    return {
      header: 'Empfohlene Literatur',
      rows: literatureContent(deContent, enContent),
    }
  }

  function particularitiesContentSection() {
    return {
      header: 'Besonderheiten',
      rows: particularitiesContent(deContent, enContent),
    }
  }

  function currentMultipleSelectionValue<A>(
    attr: string,
    fallback: (metadata: MetadataLike) => A[],
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
      m => persons.filter(p => m.lecturers.some(l => l === p.id)),
    )
  }

  function currentPrerequisitesModulesSelection(attr: string, kind: PrerequisitesKind) {
    return currentMultipleSelectionValue(
      attr,
      m => modules.filter(x => {
        const modules = kind === 'required'
          ? m.prerequisites.required?.modules
          : m.prerequisites.recommended?.modules
        return modules?.some(y => y === x.id)
      }),
    )
  }

  function currentPrerequisitesStudyProgramSelection(attr: string, kind: PrerequisitesKind) {
    return currentMultipleSelectionValue(
      attr,
      m => studyPrograms.filter(sp => {
        const pos = kind === 'required'
          ? m.prerequisites.required?.pos
          : m.prerequisites.recommended?.pos
        return pos?.some(po => po === sp.po.id)
      }),
    )
  }

  function currentCompetencesSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => competences.filter(c => m.competences.some(x => x === c.id)),
    )
  }

  function currentGlobalCriteriaSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => globalCriteria.filter(g => m.globalCriteria.some(x => x === g.id)),
    )
  }

  function currentTaughtWithSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => modules.filter(mod => m.taughtWith.some(x => x === mod.id)),
    )
  }

  function currentParticipants(attr: string): Participants | undefined {
    const res = currentMultipleSelectionValue(attr, m => mapOpt(m.participants, a => [a]) ?? [])
    return res.length === 0 ? undefined : res[0]
  }

  function currentModuleRelation(attr: string): ModuleRelation | undefined {
    const res = currentMultipleSelectionValue(attr, m => mapOpt(m.moduleRelation, a => [a]) ?? [])
    return res.length === 0 ? undefined : res[0]
  }

  return [
    generalInformationSection(),
    responsibilitySection(),
    assessmentMethodsSection(),
    workloadSection(),
    prerequisitesSection(),
    studyProgramSelection(),
    miscellaneousSection(),
    learningOutcomeContentSection(),
    moduleContentSection(),
    learningMethodsContentSection(),
    literatureContentSection(),
    particularitiesContentSection(),
  ]
}
