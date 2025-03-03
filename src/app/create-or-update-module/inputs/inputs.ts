import { simpleInput } from './simple-inputs'
import { responsibilityInput } from './responsibility-input'
import { assessmentInput, AssessmentMethodKind } from './assessment-input'
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
import { ModuleCore, ModuleLike } from '../../types/moduleCore'
import { Section } from 'src/app/form/module-form/module-form.component'
import { StudyProgram } from '../../types/module-compendium'
import { GenericModuleCore } from '../../types/genericModuleCore'
import { ExamPhase } from '../../types/core/exam-phase'
import { numberOrd, peopleOrd, stringOrd } from '../../ops/ordering.instances'
import { Ordering } from '../../ops/ordering'

export const requiredLabel = (label: string): string => label + ' *'

export const optionalLabel = (label: string): string => label + ' (Optional)'

export type Lang = 'de' | 'en'

export function inputs(
  modules: ModuleCore[],
  genericModules: GenericModuleCore[],
  moduleTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  identities: Identity[],
  assessmentMethods: AssessmentMethod[],
  studyPrograms: StudyProgram[],
  examPhases: ExamPhase[],
  dialog: MatDialog,
  fromControlValueForAttr: (attr: string) => unknown,
  moduleCompendium?: ModuleLike,
  metadataId?: string,
): Section<unknown, unknown>[] {
  const metadata = moduleCompendium?.metadata
  const deContent = moduleCompendium?.deContent
  const enContent = moduleCompendium?.enContent

  identities.sort(peopleOrd)
  assessmentMethods.sort(Ordering.contraMap(stringOrd, (a) => a.deLabel))
  studyPrograms.sort(
    Ordering.many<StudyProgram>([
      Ordering.contraMap(stringOrd, (_) => _.deLabel),
      Ordering.contraMap(stringOrd, (_) => _.degree.id),
      Ordering.contraMap(numberOrd, (_) => _.po.version),
    ]),
  )
  modules.sort(Ordering.contraMap(stringOrd, (_) => _.title))
  examPhases.sort(Ordering.contraMap(stringOrd, (_) => _.label))

  function currentMultipleSelectionValue<A>(
    attr: string,
    fallback: (_: MetadataLike) => A[],
  ): A[] {
    const entries = fromControlValueForAttr(attr)
    if (Array.isArray(entries)) {
      const xs = entries as Record<'value', A>[]
      return xs.map((e) => e.value)
    }
    return metadata ? fallback(metadata) : []
  }

  function currentParticipants(attr: string): Participants | undefined {
    const res = currentMultipleSelectionValue(
      attr,
      (m) => mapOpt(m.participants, (a) => [a]) ?? [],
    )
    return res.length === 0 ? undefined : res[0]
  }

  function currentModuleRelation(attr: string): ModuleRelation | undefined {
    const res = currentMultipleSelectionValue(
      attr,
      (m) => mapOpt(m.moduleRelation, (a) => [a]) ?? [],
    )
    return res.length === 0 ? undefined : res[0]
  }

  function generalInformationSection(): Section<unknown, unknown> {
    return {
      header: $localize`Allgemeine Informationen`,
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

  function currentLecturerSelection(attr: string) {
    return currentMultipleSelectionValue(attr, (m) =>
      identities.filter((p) => m.lecturers.some((l) => l === p.id)),
    )
  }

  function responsibilitySection() {
    return {
      header: $localize`Verantwortliche`,
      rows: responsibilityInput(
        dialog,
        identities,
        currentLecturerSelection,
        metadata?.moduleManagement,
      ),
    }
  }

  function currentAssessmentMethodEntrySelection(
    attr: string,
    kind: AssessmentMethodKind,
  ) {
    return currentMultipleSelectionValue(attr, (m) =>
      kind === 'mandatory'
        ? m.assessmentMethods.mandatory
        : m.assessmentMethods.optional,
    )
  }

  function currentExamPhasesSelection(attr: string) {
    return currentMultipleSelectionValue(attr, (m) =>
      examPhases.filter((p) => m.examPhases.includes(p.id)),
    )
  }

  function assessmentSection() {
    return {
      header: $localize`Prüfungsleistungen`,
      rows: assessmentInput(
        dialog,
        assessmentMethods,
        currentAssessmentMethodEntrySelection,
        examPhases,
        currentExamPhasesSelection,
        identities,
        metadata,
      ),
    }
  }

  function workloadSection() {
    return {
      header: $localize`Workload`,
      rows: workloadInput(metadata?.workload),
    }
  }

  function currentPrerequisitesModulesSelection(
    attr: string,
    kind: PrerequisitesKind,
  ) {
    return currentMultipleSelectionValue(attr, (m) =>
      modules.filter((x) => {
        const mods =
          kind === 'required'
            ? m.prerequisites.required?.modules
            : m.prerequisites.recommended?.modules
        return mods?.some((y) => y === x.id)
      }),
    )
  }

  function currentPrerequisitesStudyProgramSelection(
    attr: string,
    kind: PrerequisitesKind,
  ) {
    return currentMultipleSelectionValue(attr, (m) =>
      studyPrograms.filter((sp) => {
        const pos =
          kind === 'required'
            ? m.prerequisites.required?.pos
            : m.prerequisites.recommended?.pos
        return pos?.some((po) => po === sp.po.id)
      }),
    )
  }

  function prerequisitesSection() {
    return {
      header: $localize`Voraussetzungen`,
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
      header: $localize`Verwendung des Moduls in weiteren Studiengängen`,
      rows: studyProgramInput(
        dialog,
        studyPrograms,
        genericModules,
        (attr) => currentMultipleSelectionValue(attr, (m) => m.po.mandatory),
        (attr) => currentMultipleSelectionValue(attr, (m) => m.po.optional),
      ),
    }
  }

  function currentTaughtWithSelection(attr: string) {
    return currentMultipleSelectionValue(attr, (m) =>
      modules.filter((mod) => m.taughtWith.some((x) => x === mod.id)),
    )
  }

  function miscellaneousSection() {
    return {
      header: $localize`Sonstige Informationen`,
      rows: miscellaneousInput(dialog, modules, currentTaughtWithSelection),
    }
  }

  function learningOutcomeContentSection() {
    return {
      header: $localize`Angestrebte Lernergebnisse`,
      rows: learningOutcomeContent(deContent, enContent),
    }
  }

  function moduleContentSection() {
    return {
      header: $localize`Modulinhalte`,
      rows: moduleContent(deContent, enContent),
    }
  }

  function learningMethodsContentSection() {
    return {
      header: $localize`Lehr- und Lernmethoden`,
      rows: learningMethodsContent(deContent, enContent),
    }
  }

  function literatureContentSection() {
    return {
      header: $localize`Empfohlene Literatur`,
      rows: literatureContent(deContent, enContent),
    }
  }

  function particularitiesContentSection() {
    return {
      header: $localize`Besonderheiten`,
      rows: particularitiesContent(deContent, enContent),
    }
  }

  return [
    generalInformationSection(),
    responsibilitySection(),
    assessmentSection(),
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
