export interface RestrictedAdmission {
  value: boolean
  deReason: string
  enReason: string
}

export interface StudyProgramDeprecated {
  abbrev: string,
  deLabel: string,
  enLabel: string,
  internalAbbreviation: string,
  externalAbbreviation: string,
  deUrl: string,
  enUrl: string,
  grade: string,
  programDirector: string,
  accreditationUntil: Date,
  restrictedAdmission: RestrictedAdmission,
  studyForm: string[],
  language: string[],
  seasons: string[],
  campus: string[],
  deDescription: string,
  deNote: string,
  enDescription: string,
  enNote: string
}
