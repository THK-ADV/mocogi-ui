import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'

export function moduleContent(): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `module-content-${lang}`,
      disabled: false,
      required: false
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Modulinhalte (deutsch)'
      case 'en':
        return 'Module Content (english)'
    }
  }

  return [go('de'), go('en')]
}
