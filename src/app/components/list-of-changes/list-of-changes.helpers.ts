import { ModuleDraftKeys } from '../../http/http.service'
import { Module } from '../../types/moduleCore'

type ChangeType = 'add' | 'clear' | 'update' | 'unchanged'

// TODO remove as soon as the backend provides the change log
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/ban-ts-comment */

function accessObject<T>(item: T, property: string) {
  if (property.includes('.')) {
    return property.split('.').reduce((object, key) => {
      // @ts-ignore
      return { ...object }[key]
    }, item)
  }
  // @ts-ignore
  return item[property]
}

/* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/ban-ts-comment */

function getChangeType(
  modifiedKey: string,
  updatedModuleCompendium: Module,
  initialModuleCompendium: Module,
): ChangeType {
  const updatedValue = JSON.stringify(
    accessObject(updatedModuleCompendium, modifiedKey),
  )
  const initialValue = JSON.stringify(
    accessObject(initialModuleCompendium, modifiedKey),
  )
  if (updatedValue === '""') {
    return 'clear'
  }
  if (initialValue === '""') {
    return 'add'
  }
  if (initialValue !== updatedValue) {
    return 'update'
  }
  return 'unchanged'
}

export function buildChangeLog(
  moduleDraftKeys: ModuleDraftKeys,
  moduleCompendium: Module,
  stagingModuleCompendium: Module,
) {
  const detailDescriptions: {
    [key in ChangeType]: { message: string; icon: string }
  } = {
    add: { message: $localize`wurde hinzugefügt`, icon: 'add' },
    clear: { message: $localize`wurde entfernt`, icon: 'remove' },
    update: { message: $localize`wurde aktualisiert`, icon: 'edit' },
    unchanged: { message: $localize`unverändert`, icon: 'home' },
  }

  return moduleDraftKeys.modifiedKeys.map((modifiedKey) => {
    const type = getChangeType(
      modifiedKey.id,
      moduleCompendium,
      stagingModuleCompendium,
    )
    return {
      icon: detailDescriptions[type].icon,
      name: modifiedKey.label,
      details: detailDescriptions[type].message,
      toBeReviewed: moduleDraftKeys.keysToBeReviewed.includes(modifiedKey),
    }
  })
}
