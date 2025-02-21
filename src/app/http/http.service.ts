import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { Location } from '../types/core/location'
import { Language } from '../types/core/language'
import { Status } from '../types/core/status'
import { AssessmentMethod } from '../types/core/assessment-method'
import { ModuleType } from '../types/core/module-type'
import { Season } from '../types/core/season'
import { Identity } from '../types/core/person'
import { GlobalCriteria } from '../types/core/global-criteria'
import { Competence } from '../types/core/competence'
import { Module, ModuleCore, ModuleProtocol } from '../types/moduleCore'
import { ModuleDraft, ModuleDraftSource } from '../types/module-draft'
import { ValidationResult } from '../types/validation-result'
import { ModuleView } from '../types/module-view'
import { asRecord } from '../parser/record-parser'

import { ModeratedModule, ModuleDraftState } from '../types/moderated.module'
import { Approval } from '../types/approval'
import {
  ModuleCatalog,
  StudyProgram,
  StudyProgramCore,
} from '../types/module-compendium'
import { ElectivesCatalogue } from '../types/electivesCatalogues'
import { GenericModuleCore } from '../types/genericModuleCore'
import { ExamPhase } from '../types/core/exam-phase'
import { generateSemestersAroundYear } from '../helper/semester.helper'
import { StudyProgramPrivileges } from '../types/study-program-privileges'
import { Metadata } from '../types/metadata'
import { Content } from '../types/content'

export interface ModuleDraftJson {
  module: string
  user: string
  branch: string
  source: ModuleDraftSource
  data: string
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: string
}

export interface ModuleKey {
  id: string
  label: string
  desc: string
}

export type ModuleDraftKeys = {
  modifiedKeys: Array<ModuleKey>
  keysToBeReviewed: Array<ModuleKey>
}

interface ModeratedModuleJson {
  module: ModuleCore
  moduleDraft: ModuleDraftJson | undefined
  moduleDraftState: ModuleDraftState
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  // Modules

  allModules = (): Observable<ModuleCore[]> =>
    this.http.get<ModuleCore[]>('modules?source=all')

  allGenericModules = (): Observable<GenericModuleCore[]> =>
    this.http.get<GenericModuleCore[]>('modules?type=generic&source=all')

  // Module Compendium

  latestModuleDescriptionById = (id: string): Observable<Module> =>
    this.http.get<Module>(`modules/${id}/latest`)

  stagingModuleDescriptionById = (id: string): Observable<Module> =>
    this.http.get<Module>(`modules/${id}/preview`)

  moduleHtmlFile = (id: string) =>
    this.http.request('GET', `modules/${id}/file`, { responseType: 'text' })

  latestModuleHtmlFile = (id: string) =>
    this.http.request('GET', `modules/${id}/latest/file`, {
      responseType: 'text',
    })

  // Core Data

  allLocations = (): Observable<Location[]> =>
    this.http.get<Location[]>('locations')

  allLanguages = (): Observable<Language[]> =>
    this.http.get<Language[]>('languages')

  allStatus = (): Observable<Status[]> => this.http.get<Status[]>('status')

  allAssessmentMethods = (): Observable<AssessmentMethod[]> =>
    this.http.get<AssessmentMethod[]>('assessmentMethods')

  allAssessmentMethodsForModule = (
    module: string,
  ): Observable<AssessmentMethod[]> =>
    this.http.get<AssessmentMethod[]>(`assessmentMethods?module=${module}`)

  allValidAssessmentMethods = (): Observable<AssessmentMethod[]> =>
    this.http.get<AssessmentMethod[]>(`assessmentMethods?source=rpo`)

  allModuleTypes = (): Observable<ModuleType[]> =>
    this.http.get<ModuleType[]>('moduleTypes')

  allSeasons = (): Observable<Season[]> => this.http.get<Season[]>('seasons')

  allIdentities = (): Observable<Identity[]> =>
    this.http.get<Identity[]>('identities')

  allGlobalCriteria = (): Observable<GlobalCriteria[]> =>
    this.http.get<GlobalCriteria[]>('globalCriteria')

  allStudyProgramCores = (): Observable<StudyProgramCore[]> =>
    this.http.get<StudyProgram[]>('studyPrograms?extend=false')

  allCompetences = (): Observable<Competence[]> =>
    this.http.get<Competence[]>('competences')

  allExamPhases = (): Observable<ExamPhase[]> =>
    this.http.get<ExamPhase[]>('examPhases')

  // Draft

  createNewDraft = (mc: ModuleProtocol): Observable<ModuleDraft> =>
    this.http
      .post<ModuleDraftJson>('moduleDrafts', mc, {
        headers: { 'Mocogi-Version-Scheme': 'v1.0s' },
      })
      .pipe(map(this.convertModuleDraft))

  updateModuleDraft = (
    moduleId: string,
    moduleCompendiumProtocol: ModuleProtocol,
  ): Observable<unknown> =>
    this.http.put(`moduleDrafts/${moduleId}`, moduleCompendiumProtocol, {
      headers: { 'Mocogi-Version-Scheme': 'v1.0s' },
    })

  deleteDraft = (moduleId: string) =>
    this.http.delete(`moduleDrafts/${moduleId}`)

  // Module Draft

  moduleDraftKeys = (moduleId: string): Observable<ModuleDraftKeys> =>
    this.http.get<ModuleDraftKeys>(`moduleDrafts/${moduleId}/keys`)

  moderatedModules = (): Observable<ModeratedModule[]> =>
    this.http.get<ModeratedModuleJson[]>('moduleDrafts/own').pipe(
      map((xs) =>
        xs.map((x) => {
          return {
            ...x,
            moduleDraft:
              x.moduleDraft != null
                ? this.convertModuleDraft(x.moduleDraft)
                : undefined,
          }
        }),
      ),
    )

  private convertModuleDraft = (draft: ModuleDraftJson): ModuleDraft => {
    const record = asRecord(draft.data)
    // TODO improve
    const mc: ModuleProtocol = {
      deContent: record['deContent'] as Content,
      enContent: record['enContent'] as Content,
      metadata: record['metadata'] as Metadata,
    }
    return { ...draft, lastModified: new Date(draft.lastModified), data: mc }
  }

  mergeRequestUrl = (module: string): Observable<string> =>
    this.http.get<string>(`moduleDrafts/${module}/mrurl`)

  // Validation

  validate = (branch: string): Observable<ValidationResult> =>
    this.http.get<ValidationResult>(`moduleDrafts/${branch}/validate`)

  // View

  allStudyPrograms = (): Observable<ReadonlyArray<StudyProgram>> =>
    this.http.get<ReadonlyArray<StudyProgram>>('studyPrograms?extend=true')

  allModuleAtomic = (): Observable<ModuleView[]> =>
    this.http.get<ModuleView[]>('modules?extend=true')

  // Review

  requestReview = (moduleId: string): Observable<unknown> =>
    this.http.post(`moduleReviews/${moduleId}`, {})

  cancelReview = (moduleId: string): Observable<unknown> =>
    this.http.delete(`moduleReviews/${moduleId}`)

  // Approval

  ownApprovals = (): Observable<Approval[]> =>
    this.http.get<Approval[]>('moduleApprovals/own')

  getApprovals = (moduleId: string): Observable<ReadonlyArray<Approval>> =>
    this.http.get<ReadonlyArray<Approval>>(`moduleApprovals/${moduleId}`)

  submitApproval = (
    moduleId: string,
    approvalId: string,
    action: 'approve' | 'reject',
    comment?: string,
  ): Observable<unknown> =>
    this.http.put(`moduleApprovals/${moduleId}/${approvalId}`, {
      action,
      comment,
    })

  // Semester

  getSemesters = () => {
    const currentYear = new Date().getFullYear()
    const rangeInYears = 5
    const semesters = generateSemestersAroundYear(currentYear, rangeInYears)
    return of(semesters)
  }

  // Module Compendium List

  allModuleCatalogs = (
    semester: string,
  ): Observable<ReadonlyArray<ModuleCatalog>> =>
    this.http.get<ReadonlyArray<ModuleCatalog>>(`moduleCatalogs/${semester}`)

  getModuleCatalogPreview = (
    studyProgram: string,
    po: string,
  ): Observable<Blob> =>
    this.http.get(`moduleCatalogs/preview/${studyProgram}/${po}`, {
      headers: { Accept: 'application/pdf' },
      responseType: 'blob',
    })

  // Permissions

  getPermissions = (moduleId: string): Observable<Array<string>> =>
    this.http.get<Array<string>>(`moduleUpdatePermissions/${moduleId}`)

  setPermissions = (
    moduleId: string,
    permissions: ReadonlyArray<string>,
  ): Observable<unknown> =>
    this.http.post(`moduleUpdatePermissions/${moduleId}`, permissions)

  // Electives Catalogues

  allElectivesCatalogues = (
    semester: string,
  ): Observable<ReadonlyArray<ElectivesCatalogue>> =>
    this.http.get<ReadonlyArray<ElectivesCatalogue>>(
      `electivesCatalogs/${semester}`,
    )

  // Personal Data

  getPersonalData = (): Observable<
    Record<'privileges', StudyProgramPrivileges[]>
  > => this.http.get<Record<'privileges', StudyProgramPrivileges[]>>('me')

  // Exam Lists

  getExamListsPreview = (studyProgram: string, po: string): Observable<Blob> =>
    this.http.get(`examLists/preview/${studyProgram}/${po}`, {
      headers: { Accept: 'application/pdf' },
      responseType: 'blob',
    })
}
