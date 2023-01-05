import { Language, Location, Metadata, ModuleType, Participants, Season, Status } from '../../http/http.service'
import { NumberInput, TextInput } from '../../form/plain-input/plain-input.component'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showLabel } from '../../ops/show-instances'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { optionalLabel } from './inputs'
import { mapOpt } from '../../ops/undefined-ops'
import { ParticipantsComponent } from '../../form/participants/participants.component'
import { MatDialog } from '@angular/material/dialog'

export function simpleInput(
  dialog: MatDialog,
  modulesTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  currentParticipants: (attr: string) => Participants | undefined,
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
      show: showLabel,
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
      show: showLabel,
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
      show: showLabel,
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
      show: showLabel,
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
      show: showLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.status))
    }
  }

  function participantsInput(): ReadOnlyInput<Participants, Participants> {
    const attr = 'participants'
    const entries = currentParticipants(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Teilnehmerbegrenzung'),
      attr: attr,
      disabled: false,
      required: false,
      options: [],
      show: showParticipants,
      initialValue: () => mapOpt(entries, a => [a]) ?? [],
      dialogInstance: () => participantsDialogInstance(attr)
    }
  }

  function participantsDialogInstance(attr: string) {
    return ParticipantsComponent.instance(dialog, currentParticipants(attr))
  }

  function showParticipants(p: Participants): string {
    return `${p.min} - ${p.max} Teilnehmer`
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
    participantsInput()
  ]
}
