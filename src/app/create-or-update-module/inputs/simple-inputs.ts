import { Language, Location, Metadata, ModuleType, Season, Status } from '../../http/http.service'
import { NumberInput, TextInput } from '../../form/plain-input/plain-input.component'
import { OptionsInput } from '../../form/options-input/options-input.component'

export const titleInput = (metadata?: Metadata): TextInput =>
  ({
    kind: 'text',
    label: 'Modulbezeichnung',
    attr: 'title',
    disabled: false,
    required: true,
    initialValue: metadata?.title
  })

export const abbreviationInput = (metadata?: Metadata): TextInput =>
  ({
    kind: 'text',
    label: 'Modulabkürzung',
    attr: 'abbreviation',
    disabled: false,
    required: true,
    initialValue: metadata?.abbrev
  })

export const moduleTypesInput = (modulesTypes: ModuleType[], metadata?: Metadata): OptionsInput<ModuleType> =>
  ({
    kind: 'options',
    label: 'Art des Moduls',
    attr: 'moduleType',
    disabled: false,
    required: true,
    data: modulesTypes,
    show: a => a.deLabel,
    initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.moduleType))
  })

export const creditsInput = (metadata?: Metadata): NumberInput =>
  ({
    kind: 'number',
    label: 'ECTS credits',
    attr: 'ects',
    disabled: false,
    required: true,
    initialValue: metadata?.ects,
    min: 1
  })

export const languagesInput = (languages: Language[], metadata?: Metadata): OptionsInput<Language> =>
  ({
    kind: 'options',
    label: 'Sprache',
    attr: 'language',
    disabled: false,
    required: true,
    data: languages,
    show: a => a.deLabel,
    initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.language))
  })

export const durationInput = (metadata?: Metadata): NumberInput =>
  ({
    kind: 'number',
    label: 'Dauer des Moduls',
    attr: 'duration',
    disabled: false,
    required: true,
    initialValue: metadata?.duration,
    min: 1
  })

export const frequencyInput = (seasons: Season[], metadata?: Metadata): OptionsInput<Season> =>
  ({
    kind: 'options',
    label: 'Häufigkeit des Angebots',
    attr: 'season',
    disabled: false,
    required: true,
    data: seasons,
    show: a => a.deLabel,
    initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.season))
  })

export const locationsInput = (locations: Location[], metadata?: Metadata): OptionsInput<Location> =>
  ({
    kind: 'options',
    label: 'Angeboten am Standort',
    attr: 'location',
    disabled: false,
    required: true,
    data: locations,
    show: a => a.deLabel,
    initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.location))
  })

export const statusInput = (status: Status[], metadata?: Metadata): OptionsInput<Status> =>
  ({
    kind: 'options',
    label: 'Status',
    attr: 'status',
    disabled: false,
    required: true,
    data: status,
    show: a => a.deLabel,
    initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.status))
  })
