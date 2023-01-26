import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'

export function literatureContent(deContent?: Content, enContent?: Content): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `literature-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang)
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

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.recommendedReading ?? ''
      case 'en':
        return enContent?.recommendedReading ?? ''
    }
  }

  return [go('de'), go('en')]
}
