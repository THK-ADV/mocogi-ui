import { Language, Location, Metadata, ModuleType, Season, Status } from '../../http/http.service'
import { NumberInput, TextInput } from '../../form/plain-input/plain-input.component'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'

export function simpleInput(
  modulesTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  metadata?: Metadata
): FormInput[] {
  function titleInput(): TextInput {
    return {
      kind: 'text',
      label: 'Modulbezeichnung',
      attr: 'title',
      disabled: false,
      required: true,
      initialValue: metadata?.title
    }
  }

  function abbreviationInput(): TextInput {
    return {
      kind: 'text',
      label: 'Modulabkürzung',
      attr: 'abbreviation',
      disabled: false,
      required: true,
      initialValue: metadata?.abbrev
    }
  }

  function moduleTypesInput(): OptionsInput<ModuleType> {
    return {
      kind: 'options',
      label: 'Art des Moduls',
      attr: 'moduleType',
      disabled: false,
      required: true,
      data: modulesTypes,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.moduleType))
    }
  }

  function creditsInput(): NumberInput {
    return {
      kind: 'number',
      label: 'ECTS credits',
      attr: 'ects',
      disabled: false,
      required: true,
      initialValue: metadata?.ects,
      min: 1
    }
  }

  function languagesInput(): OptionsInput<Language> {
    return {
      kind: 'options',
      label: 'Sprache',
      attr: 'language',
      disabled: false,
      required: true,
      data: languages,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.language))
    }
  }

  function durationInput(): NumberInput {
    return {
      kind: 'number',
      label: 'Dauer des Moduls',
      attr: 'duration',
      disabled: false,
      required: true,
      initialValue: metadata?.duration,
      min: 1
    }
  }

  function frequencyInput(): OptionsInput<Season> {
    return {
      kind: 'options',
      label: 'Häufigkeit des Angebots',
      attr: 'season',
      disabled: false,
      required: true,
      data: seasons,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.season))
    }
  }

  function locationsInput(): OptionsInput<Location> {
    return {
      kind: 'options',
      label: 'Angeboten am Standort',
      attr: 'location',
      disabled: false,
      required: true,
      data: locations,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.location))
    }
  }

  function statusInput(): OptionsInput<Status> {
    return {
      kind: 'options',
      label: 'Status',
      attr: 'status',
      disabled: false,
      required: true,
      data: status,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.status))
    }
  }

  return [
    titleInput(),
    abbreviationInput(),
    moduleTypesInput(),
    creditsInput(),
    languagesInput(),
    durationInput(),
    frequencyInput(),
    locationsInput(),
    statusInput(),
  ]
}
