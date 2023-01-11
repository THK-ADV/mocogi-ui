export interface PO {
  abbrev: string,
  version: number,
  date: Date,
  dateFrom: Date,
  dateTo?: Date,
  modificationDates: Date[],
  program: string
}
