import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'

export function learningMethodsContent(): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `learning-methods-content-${lang}`,
      disabled: false,
      required: false
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Lehr- und Lernmethoden (deutsch)'
      case 'en':
        return 'Teaching and Learning Methods (english)'
    }
  }

  return [go('de'), go('en')]
}
