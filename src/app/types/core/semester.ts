export enum SemesterType { Summer, Winter }

export enum Language {
  'de-DE' = 'de-DE',
  'en-US' = 'en-US',
  'en-UK' = 'en-UK',
}

export const semesterLocalization = {
  [SemesterType.Winter]: {
    default: {
      'de-DE': 'WiSe',
      'en-US': 'WiSe',
      'en-UK': 'WiSe'
    },
    short: {
      'de-DE': 'WS',
      'en-US': 'WS',
      'en-UK': 'WS'
    },
    long: {
      'de-DE': 'Wintersemester',
      'en-US': 'Winter Semester',
      'en-UK': 'Winter Semester'
    },
  },
  [SemesterType.Summer]: {
    default: {
      'de-DE': 'SoSe',
      'en-US': 'SuSe',
      'en-UK': 'SuSe'
    },
    short: {
      'de-DE': 'SS',
      'en-US': 'SS',
      'en-UK': 'SS'
    },
    long: {
      'de-DE': 'Sommersemester',
      'en-US': 'Summer Semester',
      'en-UK': 'Summer Semester'
    },
  }
}

export interface SemesterAtomic {
  type: SemesterType
  year: string,
  beginDate: Date,
  endDate: Date,
}

export interface LocalizedSemester extends SemesterAtomic {
  defaultLabel: string,
  shortLabel: string,
  longLabel: string
}

export function localizeSemester(semester: SemesterAtomic, language: Language) {
  return {
    ...semester,
    defaultLabel: () => `${semesterLocalization[semester.type].default[language]} ${semester.year}`,
    shortLabel: () => `${semesterLocalization[semester.type].short[language]} ${semester.year.slice(-2)}`,
    longLabel: () => `${semesterLocalization[semester.type].long[language]} ${semester.year}`
  }
}