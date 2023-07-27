import { simpleInput } from './simple-inputs'
import { responsibilityInput } from './responsibility-input'
import { assessmentMethodInput, AssessmentMethodKind } from './assessment-method-input'
import { workloadInput } from './workload-input'
import { MatDialog } from '@angular/material/dialog'
import { prerequisitesInputs, PrerequisitesKind } from './prerequisites-input'
import { poInput } from './po-input'
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
import { Person } from '../../types/core/person'
import { POPreview } from '../../types/pos'
import { GlobalCriteria } from '../../types/core/global-criteria'
import { Competence } from '../../types/core/competence'
import { Module } from '../../types/module'
import { ModuleCompendiumLike } from '../../types/module-compendium'
import { FormInput } from '../../form/form-input'

export const requiredLabel = (label: string): string =>
  label + ' *'

export const optionalLabel = (label: string): string =>
  label + ' (Optional)'

export type Lang = 'de' | 'en'

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
  fromControlValueForAttr: (attr: string) => unknown,
  moduleCompendium?: ModuleCompendiumLike,
  metadataId?: string,
): { header: string, value: FormInput<unknown, unknown>[] }[] {
  const metadata = moduleCompendium?.metadata
  const deContent = moduleCompendium?.deContent
  const enContent = moduleCompendium?.enContent

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
      value: responsibilityInput(dialog, persons, currentLecturerSelection, metadata?.moduleManagement),
    }
  }

  function assessmentMethodsSection() {
    return {
      header: 'Prüfungsformen',
      value: assessmentMethodInput(dialog, assessmentMethods, currentAssessmentMethodEntrySelection),
    }
  }

  function workloadSection() {
    return {
      header: 'Workload',
      value: workloadInput(metadata?.workload),
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
        metadata?.prerequisites,
      ),
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
      ),
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
        currentTaughtWithSelection,
      ),
    }
  }

  function learningOutcomeContentSection() {
    return {
      header: 'Angestrebte Lernergebnisse',
      value: learningOutcomeContent(deContent, enContent),
    }
  }

  function moduleContentSection() {
    return {
      header: 'Modulinhalte',
      value: moduleContent(deContent, enContent),
    }
  }

  function learningMethodsContentSection() {
    return {
      header: 'Lehr- und Lernmethoden',
      value: learningMethodsContent(deContent, enContent),
    }
  }

  function literatureContentSection() {
    return {
      header: 'Empfohlene Literatur',
      value: literatureContent(deContent, enContent),
    }
  }

  function particularitiesContentSection() {
    return {
      header: 'Besonderheiten',
      value: particularitiesContent(deContent, enContent),
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

  function currentPrerequisitesPOsSelection(attr: string, kind: PrerequisitesKind) {
    return currentMultipleSelectionValue(
      attr,
      m => pos.filter(x => {
        const pos = kind === 'required'
          ? m.prerequisites.required?.pos
          : m.prerequisites.recommended?.pos
        return pos?.some(y => y === x.id)
      }),
    )
  }

  function currentCompetencesSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => competences.filter(c => m.competences.some(x => x === c.abbrev)),
    )
  }

  function currentGlobalCriteriaSelection(attr: string) {
    return currentMultipleSelectionValue(
      attr,
      m => globalCriteria.filter(g => m.globalCriteria.some(x => x === g.abbrev)),
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
    poSection(),
    miscellaneousSection(),
    learningOutcomeContentSection(),
    moduleContentSection(),
    learningMethodsContentSection(),
    literatureContentSection(),
    particularitiesContentSection(),
  ]
}
