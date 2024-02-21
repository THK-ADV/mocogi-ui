import { Semester } from '../types/module-compendium'

const semesterTypes = [
  { id: 'wise', abbrev: 'WiSe', deLabel: 'Wintersemester', enLabel: 'Winter Semester' },
  { id: 'sose', abbrev: 'SoSe', deLabel: 'Sommersemester', enLabel: 'Summer Semester' },
]

export const generateSemestersAroundYear = (year: number, rangeInYears: number ) => {
  const semesterList: Array<Semester> = []
  for (let i = rangeInYears * -1; i < rangeInYears; i++) {
    semesterList.push(...generateSemestersForYear(year + i))
  }
  const semesters: ReadonlyArray<Semester> = semesterList
  return semesters
}

export const generateSemestersForYear = (year: number) => {
  const semesterList: Array<Semester> = []
  semesterTypes.forEach((semesterType) => {
    semesterList.push({
      id: `${semesterType.id}_${year}`,
      year: year,
      abbrev: `${semesterType.abbrev} ${year}`,
      deLabel: `${semesterType.deLabel} ${year}`,
      enLabel: `${semesterType.enLabel} ${year}`,
    })
  })
  const semesters: ReadonlyArray<Semester> = semesterList
  return semesters
}

export const generateCurrentSemester = () => {
  const currentYear = (new Date()).getFullYear()
  const currentMonth = (new Date()).getMonth()
  const semesters = generateSemestersForYear(currentYear)
  return currentMonth < 6 ? semesters[0] : semesters[1]
}