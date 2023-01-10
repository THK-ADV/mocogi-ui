import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'

export function particularitiesContent(): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `particularities-content-${lang}`,
      disabled: false,
      required: false
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Besonderheiten (deutsch)'
      case 'en':
        return 'Particularities (english)'
    }
  }

  return [go('de'), go('en')]
}
