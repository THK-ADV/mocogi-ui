import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'

export function literatureContent(): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `literature-content-${lang}`,
      disabled: false,
      required: false
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Empfohlene Literatur (deutsch)'
      case 'en':
        return 'Recommended Reading (english)'
    }
  }

  return [go('de'), go('en')]
}
