import {
  NumberInput,
  TextInput,
} from '../../form/plain-input/plain-input.component'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { optionalLabel } from './inputs'
import { mapOpt } from '../../ops/undefined-ops'
import { ParticipantsComponent } from '../../form/participants/participants.component'
import { MatDialog } from '@angular/material/dialog'
import { ModuleRelationComponent } from '../../form/module-relation/module-relation.component'
import { Participants } from '../../types/participants'
import { ModuleRelation } from '../../types/module-relation'
import { MetadataLike } from '../../types/metadata'
import { Location } from '../../types/core/location'
import { Language } from '../../types/core/language'
import { Status } from '../../types/core/status'
import { ModuleType } from '../../types/core/module-type'
import { Season } from '../../types/core/season'
import { ModuleCore } from '../../types/moduleCore'
import { showLabel } from '../../ops/show.instances'
import { Rows } from 'src/app/form/module-form/module-form.component'

export function simpleInput(
  dialog: MatDialog,
  modulesTypes: ModuleType[],
  languages: Language[],
  seasons: Season[],
  locations: Location[],
  status: Status[],
  modules: ModuleCore[],
  currentParticipants: (attr: string) => Participants | undefined,
  currentModuleRelation: (attr: string) => ModuleRelation | undefined,
  metadata?: MetadataLike,
  metadataId?: string,
): Rows<unknown, unknown> {
  function titleInput(): TextInput {
    return {
      kind: 'text',
      label: $localize`Modulbezeichnung`,
      attr: 'title',
      disabled: false,
      required: true,
      initialValue: metadata?.title,
    }
  }

  function abbreviationInput(): TextInput {
    return {
      kind: 'text',
      label: $localize`Modulabkürzung`,
      attr: 'abbreviation',
      disabled: false,
      required: true,
      initialValue: metadata?.abbrev,
    }
  }

  function moduleTypesInput(): OptionsInput<ModuleType> {
    return {
      kind: 'options',
      label: $localize`Art des Moduls`,
      attr: 'moduleType',
      disabled: false,
      required: true,
      data: modulesTypes,
      show: showLabel,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.moduleType)),
      id: (a) => a.id,
    }
  }

  function creditsInput(): NumberInput {
    return {
      kind: 'number',
      label: $localize`ECTS credits`,
      attr: 'ects',
      disabled: false,
      required: true,
      initialValue: metadata?.ects,
      min: 1,
    }
  }

  function languagesInput(): OptionsInput<Language> {
    return {
      kind: 'options',
      label: $localize`Sprache`,
      attr: 'language',
      disabled: false,
      required: true,
      data: languages,
      show: showLabel,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.language)),
      id: (a) => a.id,
    }
  }

  function durationInput(): NumberInput {
    return {
      kind: 'number',
      label: $localize`Dauer des Moduls`,
      attr: 'duration',
      disabled: false,
      required: true,
      initialValue: metadata?.duration,
      min: 1,
    }
  }

  function frequencyInput(): OptionsInput<Season> {
    return {
      kind: 'options',
      label: $localize`Häufigkeit des Angebots`,
      attr: 'season',
      disabled: false,
      required: true,
      data: seasons,
      show: showLabel,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.season)),
      id: (a) => a.id,
    }
  }

  function locationsInput(): OptionsInput<Location> {
    return {
      kind: 'options',
      label: $localize`Angeboten am Standort`,
      attr: 'location',
      disabled: false,
      required: true,
      data: locations,
      show: showLabel,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.location)),
      id: (a) => a.id,
    }
  }

  function statusInput(): OptionsInput<Status> {
    return {
      kind: 'options',
      label: $localize`Status`,
      attr: 'status',
      disabled: false,
      required: true,
      data: status,
      show: showLabel,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.status)),
      id: (a) => a.id,
    }
  }

  function showParticipants(p: Participants): string {
    return $localize`${p.min} - ${p.max} Teilnehmer`
  }

  function showModuleRelation(m: ModuleRelation): string {
    switch (m.kind) {
      case 'parent':
        let parent = $localize`Hat Submodule: `
        m.children.forEach((id, index) => {
          const module = modules.find((_) => _.id === id)
          if (module) {
            parent += module.abbrev
            if (index !== m.children.length - 1) {
              parent += ', '
            }
          }
        })
        return parent
      case 'child':
        let child = $localize`Gehört zum Modul: `
        const module = modules.find((_) => _.id === m.parent)
        if (module) {
          child += module.abbrev
        }
        return child
    }
  }

  function moduleRelationDialogInstance(attr: string) {
    return ModuleRelationComponent.instance(
      dialog,
      currentModuleRelation(attr),
      modules,
      metadataId,
    )
  }

  function moduleRelationInput(): ReadOnlyInput<
    ModuleRelation,
    ModuleRelation
  > {
    const attr = 'module-relation'
    const entries = currentModuleRelation(attr)
    return {
      kind: 'read-only',
      label: optionalLabel($localize`Modulbeziehung`),
      attr: attr,
      disabled: false,
      required: false,
      options: [],
      show: showModuleRelation,
      initialValue: () => mapOpt(entries, (a) => [a]) ?? [],
      dialogInstance: () => moduleRelationDialogInstance(attr),
    }
  }

  function participantsDialogInstance(attr: string) {
    return ParticipantsComponent.instance(dialog, currentParticipants(attr))
  }

  function participantsInput(): ReadOnlyInput<Participants, Participants> {
    const attr = 'participants'
    const entries = currentParticipants(attr)
    return {
      kind: 'read-only',
      label: optionalLabel($localize`Teilnehmerbegrenzung`),
      attr: attr,
      disabled: false,
      required: false,
      options: [],
      show: showParticipants,
      initialValue: () => mapOpt(entries, (a) => [a]) ?? [],
      dialogInstance: () => participantsDialogInstance(attr),
    }
  }

  return {
    title: [{ input: titleInput() }],
    abbrev: [{ input: abbreviationInput() }],
    'module-types': [
      { input: moduleTypesInput() as FormInput<unknown, unknown> },
    ],
    credits: [{ input: creditsInput() }],
    languages: [{ input: languagesInput() as FormInput<unknown, unknown> }],
    duration: [{ input: durationInput() as FormInput<unknown, unknown> }],
    frequency: [{ input: frequencyInput() as FormInput<unknown, unknown> }],
    locations: [{ input: locationsInput() as FormInput<unknown, unknown> }],
    status: [{ input: statusInput() as FormInput<unknown, unknown> }],
    participants: [
      { input: participantsInput() as FormInput<unknown, unknown> },
    ],
    'module-relation': [
      { input: moduleRelationInput() as FormInput<unknown, unknown> },
    ],
  }
}
