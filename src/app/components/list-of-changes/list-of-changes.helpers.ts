import { ModuleDraftKeys } from '../../http/http.service'
import { ModuleCompendium } from '../../types/module-compendium'

export function buildChangeLog(moduleDraftKeys: ModuleDraftKeys, moduleCompendium: ModuleCompendium, stagingModuleCompendium: ModuleCompendium) {
  const detailDescriptions = {
    'add': { message: 'was added', icon: 'add' },
    'clear': { message: 'was cleared', icon:  'remove' },
    'update': { message: 'was updated', icon:  'edit' },
    'unchanged': { message: 'remains unchanged', icon:  'home' },
  }

  return moduleDraftKeys.modifiedKeys.map((modifiedKey) => {
    const type = getChangeType(modifiedKey, moduleCompendium, stagingModuleCompendium)
    return {
      icon: detailDescriptions[type].icon,
      name: modifiedKey,
      details: detailDescriptions[type].message,
      toBeReviewed: moduleDraftKeys.keysToBeReviewed.includes(modifiedKey),
    }
  })
}

function accessObject<T>(item: T, property: string) {
  if (property.includes('.')) {
    return property
      .split('.')
      .reduce((object, key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return object[key]
      }, item)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return item[property]
}


function getChangeType(modifiedKey: string, updatedModuleCompendium: ModuleCompendium, initialModuleCompendium: ModuleCompendium) {
  const updatedValue = JSON.stringify(accessObject(updatedModuleCompendium, modifiedKey))
  const initialValue = JSON.stringify(accessObject(initialModuleCompendium, modifiedKey))
  console.log(modifiedKey, { updatedValue, initialValue }, {clear: updatedValue === '', add: initialValue === '', update: initialValue !== updatedValue})
  if (updatedValue === '""') return 'clear'
  if (initialValue === '""') return 'add'
  if (initialValue !== updatedValue) return 'update'
  return 'unchanged'
}