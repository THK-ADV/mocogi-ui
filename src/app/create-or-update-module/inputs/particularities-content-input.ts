import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'

export function particularitiesContent(deContent?: Content, enContent?: Content): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `particularities-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang)
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

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.particularities ?? ''
      case 'en':
        return enContent?.particularities ?? ''
    }
  }

  return [go('de'), go('en')]
}
