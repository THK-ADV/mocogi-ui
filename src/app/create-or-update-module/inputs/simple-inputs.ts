import { Language, Location, Metadata, Module, ModuleRelation, ModuleType, Participants, Season, Status } from '../../http/http.service'
import { NumberInput, TextInput } from '../../form/plain-input/plain-input.component'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showLabel } from '../../ops/show-instances'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { optionalLabel } from './inputs'
import { mapOpt } from '../../ops/undefined-ops'
import { ParticipantsComponent } from '../../form/participants/participants.component'
import { MatDialog } from '@angular/material/dialog'
import { ModuleRelationComponent } from '../../form/module-relation/module-relation.component'

export function simpleInput(
  dialog: MatDialog,
  modulesTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  modules: Module[],
  currentParticipants: (attr: string) => Participants | undefined,
  currentModuleRelation: (attr: string) => ModuleRelation | undefined,
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

  function moduleRelationInput(): ReadOnlyInput<ModuleRelation, ModuleRelation> {
    const attr = 'module-relation'
    const entries = currentModuleRelation(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Modulbeziehung'),
      attr: attr,
      disabled: false,
      required: false,
      options: [],
      show: showModuleRelation,
      initialValue: () => mapOpt(entries, a => [a]) ?? [],
      dialogInstance: () => moduleRelationDialogInstance(attr)
    }
  }

  function showModuleRelation(m: ModuleRelation): string {
    switch (m.kind) {
      case 'parent':
        let parent = `Hat Submodule: `
        m.children.forEach((id, index) => {
          const module = modules.find(m => m.id === id)
          if (module) {
            parent += module.abbrev
            if (index !== m.children.length - 1) {
              parent += ', '
            }
          }
        })
        return parent
      case 'child':
        let child = 'Gehört zum Modul: '
        const module = modules.find(m => m.id === m.id)
        if (module) {
          child += module.abbrev
        }
        return child
    }
  }

  function moduleRelationDialogInstance(attr: string) {
    return ModuleRelationComponent.instance(dialog, currentModuleRelation(attr), modules, metadata?.id)
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
    participantsInput(),
    moduleRelationInput()
  ]
}
